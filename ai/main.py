# SafeRoute AI microservice (FastAPI + YOLO/OpenCV)
# Run: pip install -r requirements.txt && uvicorn main:app --reload --port 8000

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="SafeRoute AI")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

CATEGORIES = ["Pothole", "Road Damage", "Broken Streetlight", "Blocked Footpath", "Open Manhole", "Waterlogging", "Other"]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    # TODO: replace with real YOLO/OpenCV inference
    # For now return a plausible mock prediction
    primary = random.choice(CATEGORIES[:3])
    conf = round(random.uniform(0.85, 0.98), 2)
    distribution = {primary: conf}
    remaining = round(1 - conf, 2)
    for c in CATEGORIES:
        if c != primary:
            distribution[c] = round(remaining / (len(CATEGORIES) - 1), 3)
    return {
        "suggested_category": primary,
        "confidence": conf,
        "distribution": distribution,
        "note": "AI suggestion only - human confirmation required"
    }
`