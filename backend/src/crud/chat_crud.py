from uuid import UUID
from sqlmodel import Session, select
from src.models.chat_models import ChatMessage, ChatSession

def create_chat_session(db: Session, chat_session: ChatSession):
    db.add(chat_session)
    db.commit()
    db.refresh(chat_session)
    return chat_session

def add_chat_message(db: Session, chat_message: ChatMessage):
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)
    return chat_message

def get_user_chat_sessions(db: Session, user_id: str, limit: int = 10, offset: int = 0):
    statement = select(ChatSession).where(ChatSession.user_id == user_id).limit(limit).offset(offset).order_by(ChatSession.updated_at.desc())
    return db.exec(statement).all()

def get_chat_session_messages(db: Session, session_id: str, limit: int = 10, offset: int = 0):
    statement = select(ChatMessage).where(ChatMessage.session_id == session_id).limit(limit).offset(offset)
    return db.exec(statement).all()

def get_chat_messages_by_session_id(db: Session, session_id: UUID):
    statement = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc())
    return db.exec(statement).all()

def get_chat_session_by_id(db: Session, session_id: UUID):
    statement = select(ChatSession).where(ChatSession.id == session_id)
    return db.exec(statement).first()

def delete_chat_session(db: Session, session_id: UUID):
    statement = select(ChatSession).where(ChatSession.id == session_id)
    session = db.exec(statement).first()
    if session:
        db.delete(session)
        db.commit()
        return True
    return False

def update_chat_session_title(db: Session, session_id: UUID, new_title: str):
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    session = db.exec(stmt).first()
    if session:
        session.title = new_title
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
    return None

def get_message_by_message_id(db: Session, message_id: UUID):
    statement = select(ChatMessage).where(ChatMessage.message_id == message_id)
    return db.exec(statement).first()

def get_message_by_id(db: Session, session_id: UUID, id: str):
    statement = select(ChatMessage).where(ChatMessage.id == id)
    return db.exec(statement).first()

def update_message_content_by_id(db: Session, id: str, new_content: str):
    stmt = select(ChatMessage).where(ChatMessage.id == id)
    message = db.exec(stmt).first()
    if message:
        message.content = new_content
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
    return None

def update_chat_session_timestamp(db: Session, session_id: UUID):
    stmt = select(ChatSession).where(ChatSession.id == session_id)
    session = db.exec(stmt).first()
    if session:
        session.update_timestamp()
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
    return None