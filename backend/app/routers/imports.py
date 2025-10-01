from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_session
from .. import models
import csv
from io import StringIO
from datetime import datetime

router = APIRouter()

def get_db():
    with get_session() as s:
        yield s

@router.post("/rooms")
async def import_rooms(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = (await file.read()).decode()
    reader = csv.DictReader(StringIO(content))
    for row in reader:
        db.add(models.Room(code=row["code"], capacity=int(row["capacity"]), is_available=True))
    return {"status": "ok"}

@router.post("/classes")
async def import_classes(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = (await file.read()).decode()
    reader = csv.DictReader(StringIO(content))
    for row in reader:
        coord = None
        if row.get("coordinator_email"):
            coord = db.query(models.Coordinator).filter(models.Coordinator.email == row["coordinator_email"]).one_or_none()
            if coord is None:
                coord = models.Coordinator(name=row.get("coordinator_name", "Coordinator"), email=row["coordinator_email"])
                db.add(coord)
                db.flush()
        db.add(models.ClassCourse(code=row["code"], title=row["title"], enrollment=int(row["enrollment"]), coordinator_id=coord.id if coord else None))
    return {"status": "ok"}

@router.post("/timetable")
async def import_timetable(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = (await file.read()).decode()
    reader = csv.DictReader(StringIO(content))
    for row in reader:
        # Expect columns: class_code,date,start,end (HH:MM)
        course = db.query(models.ClassCourse).filter(models.ClassCourse.code == row["class_code"]).one_or_none()
        if not course:
            raise HTTPException(status_code=400, detail=f"Unknown class code {row['class_code']}")
        try:
            d = datetime.strptime(row["date"], "%Y-%m-%d").date()
            start_t = datetime.strptime(row["start"], "%H:%M").time()
            end_t = datetime.strptime(row["end"], "%H:%M").time()
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid date/time in row: {row}")
        db.add(models.TimetableSlot(
            class_id=course.id,
            date=d,
            start_time=start_t,
            end_time=end_t,
        ))
    return {"status": "ok"}
