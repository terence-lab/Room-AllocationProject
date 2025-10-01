from pydantic_settings import BaseSettings
from pydantic import EmailStr

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+pysqlite:///./room_alloc.db"

    # Email
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM_EMAIL: EmailStr | str = "admin@example.com"
    SMTP_TLS: bool = False

    # MQTT
    MQTT_BROKER: str = "localhost"
    MQTT_PORT: int = 1883
    MQTT_USERNAME: str | None = None
    MQTT_PASSWORD: str | None = None
    MQTT_TOPIC_PREFIX: str = "campus/rooms"

    # General
    TIMEZONE: str = "Africa/Kampala"

    class Config:
        env_file = ".env"

settings = Settings()
