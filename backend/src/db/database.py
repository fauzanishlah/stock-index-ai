from sqlmodel import SQLModel, create_engine, Session
from src.core.config import settings


# DATABASE_URL = "postgresql://user:password@localhost/postgres"
DATABASE_URL = settings.DATABASE_URI

engine = create_engine(DATABASE_URL, echo=False)

def get_db():
    with Session(engine) as session:
        yield session

def get_chat_db():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)