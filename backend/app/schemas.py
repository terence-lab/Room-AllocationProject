from pydantic import BaseModel, EmailStr
from datetime import date, time

class RoomBase(BaseModel):
    code: str
    capacity: int
    is_available: bool = True

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    class Config:
        from_attributes = True

class CoordinatorBase(BaseModel):
    name: str
    email: EmailStr

class Coordinator(CoordinatorBase):
    id: int
    class Config:
        from_attributes = True

class ClassCourseBase(BaseModel):
    code: str
    title: str
    enrollment: int
    coordinator_id: int | None = None

class ClassCourseCreate(ClassCourseBase):
    pass

class ClassCourse(ClassCourseBase):
    id: int
    class Config:
        from_attributes = True

class TimetableSlotBase(BaseModel):
    class_id: int
    date: date
    start_time: time
    end_time: time

class TimetableSlotCreate(TimetableSlotBase):
    pass

class TimetableSlot(TimetableSlotBase):
    id: int
    class Config:
        from_attributes = True

class Allocation(BaseModel):
    id: int
    slot_id: int
    room_id: int | None
    is_online: bool
    class Config:
        from_attributes = True
