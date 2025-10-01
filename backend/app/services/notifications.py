import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..config import settings
from ..models import Allocation, TimetableSlot, ClassCourse
import zoneinfo

tz = zoneinfo.ZoneInfo(settings.TIMEZONE)


def _send_email(to_email: str, subject: str, body: str):
    msg = EmailMessage()
    msg["From"] = str(settings.SMTP_FROM_EMAIL)
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        if settings.SMTP_TLS:
            server.starttls()
        if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)


def notify_upcoming_classes(session: Session):
    now = datetime.now(tz)
    window_start = now + timedelta(minutes=29)
    window_end = now + timedelta(minutes=31)

    q = (
        select(Allocation)
        .join(TimetableSlot, Allocation.slot_id == TimetableSlot.id)
        .where(TimetableSlot.date == now.date())
    )
    allocs = session.execute(q).scalars().all()
    for alloc in allocs:
        slot = alloc.slot
        dt = datetime.combine(slot.date, slot.start_time, tz)
        if window_start <= dt <= window_end:
            course: ClassCourse = slot.course
            if course.coordinator and course.coordinator.email:
                room_text = "Online (no physical room available)" if alloc.is_online or not alloc.room else alloc.room.code
                subject = f"Room Allocation for {course.code} at {slot.start_time.strftime('%H:%M')}"
                body = (
                    f"Course: {course.code} - {course.title}\n"
                    f"Start: {slot.start_time.strftime('%H:%M')}\n"
                    f"End: {slot.end_time.strftime('%H:%M')}\n"
                    f"Room: {room_text}\n"
                )
                _send_email(course.coordinator.email, subject, body)
