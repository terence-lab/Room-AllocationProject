from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from ..database import get_session
from ..services.allocation import allocate_for_date

router = APIRouter()

def get_db():
    with get_session() as s:
        yield s

@router.post("/run")
def run_allocation(target_date: date | None = None, db: Session = Depends(get_db)):
    if target_date is None:
        target_date = date.today()
    count = allocate_for_date(db, target_date)
    return {"allocated": count}
