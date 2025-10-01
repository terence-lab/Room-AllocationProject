from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_session
from .. import models, schemas

router = APIRouter()


def get_db():
    with get_session() as s:
        yield s

@router.get("/rooms", response_model=list[schemas.Room])
def list_rooms(db: Session = Depends(get_db)):
    return db.execute(select(models.Room)).scalars().all()

@router.post("/rooms", response_model=schemas.Room)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    r = models.Room(**room.model_dump())
    db.add(r)
    db.flush()
    return r

@router.post("/override/{allocation_id}")
def override_allocation(allocation_id: int, room_id: int | None = None, is_online: bool | None = None, db: Session = Depends(get_db)):
    alloc = db.get(models.Allocation, allocation_id)
    if not alloc:
        raise HTTPException(status_code=404, detail="Allocation not found")
    if room_id is not None:
        room = db.get(models.Room, room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        alloc.room_id = room_id
        alloc.is_online = False
    if is_online is not None:
        alloc.is_online = is_online
        if is_online:
            alloc.room_id = None
    db.flush()
    return {"status": "ok"}

@router.get("/allocations")
def list_allocations(db: Session = Depends(get_db)):
    data = db.execute(select(models.Allocation)).scalars().all()
    return [
        {
            "id": a.id,
            "slot_id": a.slot_id,
            "room": a.room.code if a.room else None,
            "is_online": a.is_online,
            "date": a.slot.date.isoformat(),
            "start": a.slot.start_time.strftime("%H:%M"),
            "end": a.slot.end_time.strftime("%H:%M"),
            "class": a.slot.course.code,
            "enrollment": a.slot.course.enrollment,
        }
        for a in data
    ]
