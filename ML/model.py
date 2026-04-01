import torch
import torch.nn as nn


class VehicleCountCNN(nn.Module):
    """
    Custom CNN for vehicle counting from traffic surveillance images.
    Input: RGB image (3, 224, 224)
    Output: vehicle count (single integer regression)
    """

    def __init__(self):
        super(VehicleCountCNN, self).__init__()

        # ── Feature Extraction Blocks ──────────────────────────────────────────

        # Block 1: 3 → 32 channels, 224x224 → 112x112
        self.block1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),   # 112x112
            nn.Dropout2d(0.1)
        )

        # Block 2: 32 → 64 channels, 112x112 → 56x56
        self.block2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),   # 56x56
            nn.Dropout2d(0.1)
        )

        # Block 3: 64 → 128 channels, 56x56 → 28x28
        self.block3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),   # 28x28
            nn.Dropout2d(0.2)
        )

        # Block 4: 128 → 256 channels, 28x28 → 14x14
        self.block4 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),   # 14x14
            nn.Dropout2d(0.2)
        )

        # Block 5: 256 → 512 channels, 14x14 → 7x7
        self.block5 = nn.Sequential(
            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),   # 7x7
            nn.Dropout2d(0.3)
        )

        # ── Global Average Pooling ─────────────────────────────────────────────
        self.gap = nn.AdaptiveAvgPool2d((1, 1))  # 512 x 1 x 1

        # ── Regression Head ────────────────────────────────────────────────────
        self.regressor = nn.Sequential(
            nn.Flatten(),
            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(128, 1),    # Output: single vehicle count
            nn.ReLU(inplace=True) # Count can't be negative
        )

    def forward(self, x):
        x = self.block1(x)
        x = self.block2(x)
        x = self.block3(x)
        x = self.block4(x)
        x = self.block5(x)
        x = self.gap(x)
        x = self.regressor(x)
        return x.squeeze(1)  # (batch,)


def get_model(device="cpu"):
    model = VehicleCountCNN()
    model = model.to(device)
    return model


if __name__ == "__main__":
    # Quick test
    model = get_model()
    dummy = torch.randn(2, 3, 224, 224)
    out = model(dummy)
    print(f"Model output shape: {out.shape}")  # Should be (2,)
    print(f"Sample output: {out}")
    print(f"Total parameters: {sum(p.numel() for p in model.parameters()):,}")
