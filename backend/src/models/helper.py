from uuid import UUID
from uuid_extensions import uuid7

from src.models.chat_models import ToolCall
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain_core.messages.tool import ToolCall as LCToolCall, ToolMessage
from langchain_core.messages import BaseMessage, AIMessageChunk, HumanMessageChunk, SystemMessageChunk, ToolMessageChunk

from src.models.chat_models import ChatMessage, MessageRole, ChatSession


def from_langchain_message(
    message: BaseMessage,
    session_id: UUID,
    **additional_kwargs
) -> ChatMessage:
    """Convert a LangChain message to a ChatMessage with session binding."""
    
    base_fields = {
        "session_id": session_id,
        "content": message.content,
        "additional_kwargs": {"tool_name": message.name, **message.additional_kwargs} if isinstance(message, ToolMessage) else message.additional_kwargs,
    }



    if isinstance(message, HumanMessage):
        return ChatMessage(
            role=MessageRole.HUMAN,
            id=uuid7(),
            **base_fields,
            **additional_kwargs
        )

    elif isinstance(message, AIMessage):
        tool_calls = [
            ToolCall(
                id=tc.get("id", str(uuid7())),
                name=tc["name"],
                args=tc["args"],
                type=tc.get("type", "function")
            )
            for tc in (message.tool_calls or [])
        ]
        
        return ChatMessage(
            role=MessageRole.AI,
            tool_calls=tool_calls,
            id=message.id,
            **base_fields,
            **additional_kwargs
        )

    elif isinstance(message, SystemMessage):
        return ChatMessage(
            role=MessageRole.SYSTEM,
            id=message.id,
            **base_fields,
            **additional_kwargs
        )

    elif isinstance(message, ToolMessage):
        return ChatMessage(
            role=MessageRole.TOOL,
            tool_call_id=UUID(message.tool_call_id),
            id=message.id,
            **base_fields,
            **additional_kwargs
        )

    raise ValueError(f"Unsupported message type: {type(message)}")