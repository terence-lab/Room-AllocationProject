from sqlalchemy.orm import Session
import paho.mqtt.client as mqtt
from ..config import settings
from ..models import Room, IoTDevice

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        if settings.MQTT_USERNAME and settings.MQTT_PASSWORD:
            _client.username_pw_set(settings.MQTT_USERNAME, settings.MQTT_PASSWORD)
        _client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, keepalive=60)
    return _client


def publish_room_state(session: Session, room_id: int, occupied: bool):
    topic = f"{settings.MQTT_TOPIC_PREFIX}/{room_id}/state"
    payload = "OCCUPIED" if occupied else "AVAILABLE"

    # Optional: if device exists, include device_id specific topic too
    device = session.query(IoTDevice).filter(IoTDevice.room_id == room_id).one_or_none()
    client = _get_client()
    client.publish(topic, payload, qos=1, retain=True)
    if device:
        client.publish(f"{settings.MQTT_TOPIC_PREFIX}/device/{device.device_id}", payload, qos=1, retain=True)
