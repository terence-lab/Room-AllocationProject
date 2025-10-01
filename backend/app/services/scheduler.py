from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import date
from ..database import get_session
from .allocation import allocate_for_date
from .notifications import notify_upcoming_classes
from ..config import settings
import zoneinfo

scheduler: BackgroundScheduler | None = None

def init_scheduler():
    global scheduler
    if scheduler is not None:
        return
    tz = zoneinfo.ZoneInfo(settings.TIMEZONE)
    scheduler = BackgroundScheduler(timezone=tz)

    # Allocation job: every day at 02:00
    scheduler.add_job(run_allocation_job, CronTrigger(hour=2, minute=0))

    # Notification job: every minute to catch the 30-min window
    scheduler.add_job(run_notification_job, CronTrigger(minute="*/1"))

    scheduler.start()


def shutdown_scheduler():
    global scheduler
    if scheduler:
        scheduler.shutdown()
        scheduler = None


def run_allocation_job():
    with get_session() as session:
        allocate_for_date(session, date.today())


def run_notification_job():
    with get_session() as session:
        notify_upcoming_classes(session)
