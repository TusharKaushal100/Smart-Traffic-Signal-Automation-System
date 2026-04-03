"""
train.py
────────
Trains the VehicleCountCNN on UA-DETRAC dataset.
Uses GPU (NVIDIA 3050) if available.

Usage:
    python train.py
    python train.py --epochs 30 --batch_size 32
"""

import os
import time
import argparse
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import pandas as pd
from model import get_model


# ── Dataset ────────────────────────────────────────────────────────────────────

class TrafficDataset(Dataset):

    def __init__(self, csv_path: str, transform=None):
        self.df = pd.read_csv(csv_path)
        self.transform = transform
        self.df = self.df[self.df["image_path"].apply(os.path.exists)].reset_index(drop=True)
        print(f"  [Dataset] Loaded {len(self.df)} valid images from {csv_path}")

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        img = Image.open(row["image_path"]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        count = torch.tensor(float(row["vehicle_count"]), dtype=torch.float32)
        return img, count


# ── Transforms ─────────────────────────────────────────────────────────────────

train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
    transforms.RandomRotation(5),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


# ── Training ───────────────────────────────────────────────────────────────────

def train_one_epoch(model, loader, optimizer, criterion, device, epoch):
    model.train()
    total_loss = 0
    total_mae  = 0

    for batch_idx, (images, counts) in enumerate(loader):
        images = images.to(device)
        counts = counts.to(device)

        optimizer.zero_grad()
        preds = model(images)
        loss  = criterion(preds, counts)
        loss.backward()
        optimizer.step()

        mae = torch.abs(preds - counts).mean().item()
        total_loss += loss.item()
        total_mae  += mae

        if (batch_idx + 1) % 20 == 0:
            print(f"  Epoch {epoch} | Batch {batch_idx+1}/{len(loader)} | "
                  f"Loss: {loss.item():.4f} | MAE: {mae:.2f}")

    return total_loss / len(loader), total_mae / len(loader)


def validate(model, loader, criterion, device):
    model.eval()
    total_loss = 0
    total_mae  = 0

    with torch.no_grad():
        for images, counts in loader:
            images = images.to(device)
            counts = counts.to(device)
            preds  = model(images)
            loss   = criterion(preds, counts)
            mae    = torch.abs(preds - counts).mean().item()
            total_loss += loss.item()
            total_mae  += mae

    return total_loss / len(loader), total_mae / len(loader)


def train(args):

    # ── Device ──────────────────────────────────────────────────────────────
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"\n[INFO] Using device: {device}")
    if device == "cuda":
        print(f"[INFO] GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("[WARN] GPU not found! Running on CPU — will be slow.")
        print("[WARN] Install CUDA PyTorch:")
        print("       pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118")

    # ── Data ────────────────────────────────────────────────────────────────
    train_dataset = TrafficDataset(args.train_csv, transform=train_transform)
    val_dataset   = TrafficDataset(args.val_csv,   transform=val_transform)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size,
                              shuffle=True,  num_workers=0,
                              pin_memory=(device == "cuda"))
    val_loader   = DataLoader(val_dataset,   batch_size=args.batch_size,
                              shuffle=False, num_workers=0,
                              pin_memory=(device == "cuda"))

    print(f"[INFO] Train: {len(train_dataset)} | Val: {len(val_dataset)}")

    # ── Model ────────────────────────────────────────────────────────────────
    model     = get_model(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", patience=3, factor=0.5
    )

    print(f"[INFO] Model parameters: {sum(p.numel() for p in model.parameters()):,}")

    # ── Training Loop ────────────────────────────────────────────────────────
    best_val_mae = float("inf")
    os.makedirs("checkpoints", exist_ok=True)

    print(f"\n[INFO] Starting training for {args.epochs} epochs...\n")

    for epoch in range(1, args.epochs + 1):
        start = time.time()

        train_loss, train_mae = train_one_epoch(
            model, train_loader, optimizer, criterion, device, epoch
        )
        val_loss, val_mae = validate(model, val_loader, criterion, device)

        scheduler.step(val_loss)

        elapsed = time.time() - start

        print(f"\nEpoch {epoch}/{args.epochs} ({elapsed:.1f}s) | "
              f"Train Loss: {train_loss:.4f} MAE: {train_mae:.2f} | "
              f"Val Loss: {val_loss:.4f} MAE: {val_mae:.2f}")

        if val_mae < best_val_mae:
            best_val_mae = val_mae
            torch.save(model.state_dict(), "checkpoints/best_model.pt")
            print(f"  ✅ Best model saved! Val MAE: {val_mae:.2f}")

        torch.save({
            "epoch": epoch,
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "val_mae": val_mae,
        }, "checkpoints/latest.pt")

        print()

    print(f"\n[DONE] Training complete!")
    print(f"[DONE] Best Val MAE: {best_val_mae:.2f} vehicles")
    print(f"[DONE] Model saved at: checkpoints/best_model.pt")


# ── Main ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--train_csv",   default="dataset/dataset_train.csv")
    parser.add_argument("--val_csv",     default="dataset/dataset_val.csv")
    parser.add_argument("--epochs",      type=int,   default=25)
    parser.add_argument("--batch_size",  type=int,   default=32)
    parser.add_argument("--lr",          type=float, default=1e-3)
    args = parser.parse_args()

    train(args)
