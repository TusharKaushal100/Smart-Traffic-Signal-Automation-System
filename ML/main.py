from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import uvicorn
import torch
from dotenv import dotenv_values

config = dotenv_values(".env")
PORT = int(config.get("PORT", 8000))

VEHICLE_CLASS_IDS = {2, 3, 5, 7}

# Check if GPU available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[ML] Using device: {device}")

print("[ML] Loading YOLOv8n model...")
model = YOLO("yolov8n.pt")
model.to(device)

# Warmup
print("[ML] Warming up model...")
dummy = Image.new("RGB", (640, 640))
model(dummy, verbose=False, imgsz=640, device=device)
model(dummy, verbose=False, imgsz=640, device=device)  # 2 warmups
print("[ML] Model ready!")

app = FastAPI(title="Traffic ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "Traffic ML API running",
        "model": "yolov8n",
        "device": device
    }

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Keep aspect ratio, max 640
        image.thumbnail((640, 640), Image.LANCZOS)

        results = model(
            image,
            verbose=False,
            imgsz=640,
            device=device,
            half=False,      # FP16 only on GPU
            agnostic_nms=True  # better NMS for overlapping vehicles
        )

        vehicle_count = 0
        class_counts: dict = {}
        emergency_detected = False

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                if confidence < 0.25:  # lower threshold = detect more vehicles
                    continue

                class_name = model.names[class_id]

                if class_id in VEHICLE_CLASS_IDS:
                    vehicle_count += 1
                    class_counts[class_name] = class_counts.get(class_name, 0) + 1

        print(f"[ML] Detected {vehicle_count} vehicles: {class_counts}")

        return {
            "vehicle_count": vehicle_count,
            "class_breakdown": class_counts,
            "emergency": emergency_detected,
            "status": "success"
        }

    except Exception as e:
        print(f"[ML] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
