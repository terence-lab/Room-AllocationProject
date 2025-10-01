from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, ForeignKey, Date, Time, UniqueConstraint
from .database import Base

class Room(Base):
    __tablename__ = "rooms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True)
    capacity: Mapped[int] = mapped_column(Integer)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

    device: Mapped["IoTDevice"] = relationship("IoTDevice", back_populates="room", uselist=False)
    allocations: Mapped[list["Allocation"]] = relationship("Allocation", back_populates="room")

class Coordinator(Base):
    __tablename__ = "coordinators"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String, index=True)

class ClassCourse(Base):
    __tablename__ = "classes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String)
    enrollment: Mapped[int] = mapped_column(Integer)
    coordinator_id: Mapped[int | None] = mapped_column(ForeignKey("coordinators.id"))
    coordinator: Mapped[Coordinator | None] = relationship("Coordinator")

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_id: Mapped[int] = mapped_column(ForeignKey("classes.id"), index=True)
    date: Mapped[Date] = mapped_column(Date, index=True)
    start_time: Mapped[Time] = mapped_column(Time, index=True)
    end_time: Mapped[Time] = mapped_column(Time)

    course: Mapped[ClassCourse] = relationship("ClassCourse")

    __table_args__ = (
        UniqueConstraint("class_id", "date", "start_time", name="uq_class_slot"),
    )

class Allocation(Base):
    __tablename__ = "allocations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slot_id: Mapped[int] = mapped_column(ForeignKey("timetable_slots.id"), index=True)
    room_id: Mapped[int | None] = mapped_column(ForeignKey("rooms.id"), nullable=True)
    is_online: Mapped[bool] = mapped_column(Boolean, default=False)

    slot: Mapped[TimetableSlot] = relationship("TimetableSlot")
    room: Mapped[Room | None] = relationship("Room", back_populates="allocations")

    __table_args__ = (
        UniqueConstraint("slot_id", name="uq_slot_alloc"),
    )

class IoTDevice(Base):
    __tablename__ = "iot_devices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id"), unique=True)
    device_id: Mapped[str] = mapped_column(String, unique=True, index=True)

    room: Mapped[Room] = relationship("Room", back_populates="device")
