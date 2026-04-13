"""
main.py — FastAPI ML server
Uses Custom CNN for vehicle count
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import io
import os
import uvicorn
from dotenv import dotenv_values
from torchvision import transforms

config = dotenv_values(".env")
PORT   = int(config.get("PORT", 8000))

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[ML] Using device: {device}")

MODEL_PATH = "checkpoints/best_model.pt"
USE_CUSTOM = os.path.exists(MODEL_PATH)

if USE_CUSTOM:
    print("[ML] Loading Custom CNN model...")
    from model import get_model
    model = get_model(device)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()
    print("[ML] Custom CNN loaded successfully!")
else:
    print("[ML] Custom model not found — using YOLOv8 fallback...")
    from ultralytics import YOLO
    model = YOLO("yolov8n.pt")
    model.to(device)
    dummy = Image.new("RGB", (640, 640))
    model(dummy, verbose=False, imgsz=640, device=device)
    model(dummy, verbose=False, imgsz=640, device=device)
    print("[ML] YOLOv8 fallback ready!")

cnn_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

VEHICLE_CLASS_IDS = {2, 3, 5, 7}

app = FastAPI(title="Traffic ML API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/")
def root():
    return {
        "status": "Traffic ML API running",
        "model": "Custom CNN" if USE_CUSTOM else "YOLOv8n (fallback)",
        "device": device
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        if USE_CUSTOM:
            tensor = cnn_transform(image).unsqueeze(0).to(device)
            with torch.no_grad():
                output = model(tensor)
                vehicle_count = max(0, round(output.item()))
            print(f"[ML] Custom CNN: {vehicle_count} vehicles")
            return {
                "vehicle_count": vehicle_count,
                "class_breakdown": {"vehicle": vehicle_count},
                "emergency": False,
                "model": "custom_cnn",
                "status": "success"
            }
        else:
            image.thumbnail((640, 640), Image.LANCZOS)
            results = model(image, verbose=False, imgsz=640, device=device, agnostic_nms=True)
            vehicle_count = 0
            class_counts = {}
            emergency_detected = False
            for result in results:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    if confidence < 0.25:
                        continue
                    class_name = model.names[class_id]
                    if class_id in VEHICLE_CLASS_IDS:
                        vehicle_count += 1
                        class_counts[class_name] = class_counts.get(class_name, 0) + 1
            print(f"[ML] YOLOv8: {vehicle_count} vehicles: {class_counts}")
            return {
                "vehicle_count": vehicle_count,
                "class_breakdown": class_counts,
                "emergency": emergency_detected,
                "model": "yolov8_fallback",
                "status": "success"
            }

    except Exception as e:
        print(f"[ML] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
