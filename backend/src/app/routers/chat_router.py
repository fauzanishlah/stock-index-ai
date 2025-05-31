from uuid import UUID
from fastapi import APIRouter, HTTPException, status
from src.crud import chat_crud
from src.app.deps import get_db_deps, get_current_user_deps

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_chat_session(user: get_current_user_deps, db: get_db_deps, limit: int = 10, offset: int = 0 ):
    chat_sessions = chat_crud.get_user_chat_sessions(db=db, user_id=str(user.id), limit=limit, offset=offset)
    return {
        "chat_sessions": chat_sessions,
        "count": len(chat_sessions)
    }

@router.get("/s/{session_id}")
def get_messages_by_session_id(session_id: UUID, user: get_current_user_deps, db: get_db_deps):
    messages = chat_crud.get_chat_messages_by_session_id(
        db=db,
        session_id=session_id,
    )
    return {
        "messages": messages,
        "count": len(messages)
    }

@router.delete("/s/{session_id}")
def delete_chat_session(session_id: UUID, user: get_current_user_deps, db: get_db_deps):
    if not chat_crud.delete_chat_session(db=db, session_id=session_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found or could not be deleted."
        )
    return {"message": "Chat session deleted successfully."}
