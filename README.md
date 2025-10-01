# IoT-Powered Room Allocation System

## Overview
FastAPI-based system that auto-assigns lecture rooms by capacity, avoids clashes, toggles IoT LED displays via MQTT, and emails coordinators 30 minutes before class. Includes minimal admin dashboard.

## Features
- Room-class matching by capacity with online fallback
- No double-booking within time windows
- MQTT to set LED: `OCCUPIED` or `AVAILABLE`
- Email notifications to coordinators 30 minutes before start
- Admin dashboard (simple HTML) and CSV import endpoints
- APScheduler for daily allocation and minutely notifications

## Quickstart
1. Create and populate a virtualenv, then install deps:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure environment in `.env` (see `.env.example`).
3. Initialize DB tables:
   ```python
   # one-time
   from backend.app.database import engine
   from backend.app import models
   models.Base.metadata.create_all(bind=engine)
   ```
4. Run the app:
   ```bash
   uvicorn backend.app.main:app --reload
   ```
5. Open `frontend/index.html` in a browser or serve it statically.

## CSV Formats
- Rooms: `code,capacity`
- Classes: `code,title,enrollment,coordinator_name,coordinator_email`
- Timetable: `class_code,date,start,end` (date: YYYY-MM-DD, time: HH:MM)

## IoT
- MQTT topic: `{MQTT_TOPIC_PREFIX}/{room_id}/state` with payload `OCCUPIED` or `AVAILABLE`.
- Optionally per-device: `{MQTT_TOPIC_PREFIX}/device/{device_id}`.

## Notes
- Default DB is SQLite `room_alloc.db` in project root.
- Scheduler runs at startup; for Windows dev, keep terminal open.
