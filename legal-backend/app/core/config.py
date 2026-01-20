import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Indian Legal Assistance API"
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "xiaomi/mimo-v2-flash:free")
    
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is missing in .env")

settings = Settings()