from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models import Room, TimetableSlot, Allocation
from .iot import publish_room_state


def allocate_for_date(session: Session, target_date: date) -> int:
    """
    Simple greedy allocation per date:
    - Sort classes by enrollment desc
    - Assign the smallest available room that can fit enrollment
    - Ensure no double bookings by time window
    - If none fits, mark as online
    Returns number of allocations created or updated.
    """
    count = 0

    slots = session.execute(
        select(TimetableSlot).where(TimetableSlot.date == target_date)
    ).scalars().all()

    # Fetch all rooms that are available
    rooms = session.execute(select(Room).where(Room.is_available == True)).scalars().all()  # noqa: E712
    rooms_sorted = sorted(rooms, key=lambda r: r.capacity)

    # For each slot, allocate if not allocated
    for slot in sorted(slots, key=lambda s: s.course.enrollment, reverse=True):
        alloc = session.execute(
            select(Allocation).where(Allocation.slot_id == slot.id)
        ).scalar_one_or_none()

        # remove conflicting rooms for this time window
        def room_conflicts(r: Room) -> bool:
            # Check any allocation in same time range
            existing = session.execute(
                select(Allocation).where(Allocation.room_id == r.id)
            ).scalars().all()
            for ex in existing:
                ex_slot = ex.slot
                if ex_slot.date != slot.date:
                    continue
                overlap = not (slot.end_time <= ex_slot.start_time or slot.start_time >= ex_slot.end_time)
                if overlap:
                    return True
            return False

        assigned_room = None
        for r in rooms_sorted:
            if r.capacity >= slot.course.enrollment and not room_conflicts(r):
                assigned_room = r
                break

        if alloc is None:
            alloc = Allocation(slot_id=slot.id)
            session.add(alloc)

        if assigned_room:
            alloc.room_id = assigned_room.id
            alloc.is_online = False
            count += 1
            # Update IoT display
            publish_room_state(session, assigned_room.id, occupied=True)
        else:
            alloc.room_id = None
            alloc.is_online = True
            count += 1

    session.flush()
    # Mark unallocated times as available on IoT
    for r in rooms:
        # Determine if room has any allocation at target_date
        any_occ = False
        for slot in slots:
            ex = session.execute(
                select(Allocation).where(Allocation.slot_id == slot.id, Allocation.room_id == r.id)
            ).scalar_one_or_none()
            if ex:
                any_occ = True
                break
        publish_room_state(session, r.id, occupied=any_occ)

    return count
