from uuid import UUID
from typing import List
import json 
from sqlmodel import Session
from langchain_google_vertexai import ChatVertexAI
from langchain_google_genai import ChatGoogleGenerativeAI

from src.crud import chat_crud
from src.models.chat_models import ChatMessage
from src.core.config import settings

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)
    
def format_messages(messages: List[ChatMessage]) -> List[str]:
    formatted_messages = []
    for message in messages:
        formatted_messages.append(f"{message.role.value}: {message.content}")
    return formatted_messages
    
def generate_summary_text(db: Session, session_id: UUID):
    # model = ChatVertexAI(
    #     model_name="gemini-2.0-flash",
    #     temperature=0.7,
    #     max_output_tokens=400,
    #     top_p=0.95,
    #     top_k=40,
    # )
    model = ChatGoogleGenerativeAI(model=settings.AGENT_MODEL, temperature=0.7, max_output_tokens=400, top_p=0.95, top_k=40)

    chat_messages = chat_crud.get_chat_messages_by_session_id(db, session_id)
    if not chat_messages:
        return "No messages in this session."
    prev_interaction = format_messages(chat_messages)
    prev_interaction = "\n".join(prev_interaction)
    prompt = f"""Imagine you are creating a short label or a title for a browser tab that represents the following user-AI chat. What would be a very brief (3-5 words) and informative title that captures the essence of the conversation? Your response should be just the title itself, as plain text.

Chat Log:
{prev_interaction}

Title:
"""
    try:
        response = model.invoke(prompt)
        chat_crud.update_chat_session_title(
            db=db,
            session_id=session_id,
            new_title=response.content.strip()
        )
        return response.content.strip() if response.content else chat_messages[0].content.strip()
    except Exception as e:
        return chat_messages[0].content.strip()