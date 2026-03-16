# Traffic ML API

YOLOv8-based vehicle detection API for the Smart Traffic Signal Automation System.

## Setup

```bash
# 1. Go into ml folder
cd ml

# 2. Create virtual environment (recommended)
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
python main.py
```

Server starts at: `http://localhost:8000`

---

## API

### GET /
Health check.
```json
{ "status": "Traffic ML API running ✅", "model": "yolov8n.pt" }
```

### POST /analyze
Send a traffic lane image. Returns vehicle count.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted types: `image/jpeg`, `image/png`

**Response:**
```json
{
  "vehicle_count": 7,
  "class_breakdown": {
    "car": 5,
    "truck": 2
  },
  "status": "success"
}
```

---

## Backend .env

Make sure your `backend/.env` has:
```
ML_API=http://localhost:8000
```

---

## YOLO Model

On first run, `yolov8n.pt` is **auto-downloaded** from Ultralytics (~6 MB).
You can change the model in `.env` → `MODEL_PATH=yolov8s.pt` for better accuracy.

## Vehicle Classes Detected

| Class ID | Name       |
|----------|------------|
| 2        | car        |
| 3        | motorcycle |
| 5        | bus        |
| 7        | truck      |
