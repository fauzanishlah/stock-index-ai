from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URI: str = "postgresql://user:password@localhost/postgres"
    MLFLOW_TRACKING_URL: str = "http://127.0.0.1:5000"
    AGENT_MODEL: str = "gemini-2.0-flash"
    PROJECT_ID: str

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = Settings()