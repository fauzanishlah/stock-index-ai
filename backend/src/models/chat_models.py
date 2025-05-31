from datetime import datetime
from typing import Optional, List, Dict, Any, TypedDict
from uuid import UUID
from sqlmodel import SQLModel, Field, Relationship, Column, JSON, Enum
import enum
from pydantic import BaseModel
from uuid_extensions import uuid7  # Make sure to install this package

class MessageRole(str, enum.Enum):
    HUMAN = "human"
    AI = "ai"
    SYSTEM = "system"
    TOOL = "tool"

class ToolCall(TypedDict):
    id: str 
    name: str
    args: Dict[str, Any]
    type: str

class ChatSession(SQLModel, table=True):
    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        unique=True
    )
    user_id: str = Field(index=True)
    agent: str = Field(default="default", index=True)
    title: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None, index=True)

    messages: List["ChatMessage"] = Relationship(back_populates="session")

    def update_timestamp(self):
        self.updated_at = datetime.now()

class ChatMessage(SQLModel, table=True):
    message_id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        sa_column_kwargs={"unique": True}
    )
    session_id: UUID = Field(foreign_key="chatsession.id", index=True)
    id: str = Field("")
    role: MessageRole = Field(
        default=MessageRole.HUMAN,
        sa_column=Column(Enum(MessageRole))
    )
    content: str
    tool_calls: List[ToolCall] = Field(sa_column=Column(JSON), default=[])
    tool_call_id: Optional[UUID] = Field(default=None, index=True)
    additional_kwargs: Dict[str, Any] = Field(sa_column=Column(JSON), default={})
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None, index=True)

    session: ChatSession = Relationship(back_populates="messages")

    def update_timestamp(self):
        self.updated_at = datetime.now()

    def to_langchain_message(self):
        from langchain.schema import HumanMessage, AIMessage, SystemMessage
        from langchain_core.messages.tool import ToolCall as LCToolCall, ToolMessage

        base_args = {
            "content": self.content,
            "additional_kwargs": self.additional_kwargs
        }

        if self.role == MessageRole.HUMAN:
            return HumanMessage(**base_args)
        elif self.role == MessageRole.AI:
            lc_tool_calls = [
                LCToolCall(
                    name=call.get("name", ""),
                    args=call.get("args", {}),
                    id=str(call.get("id", '')),
                    type=call.get("type", "function")
                ) if call.get("name") else None
                    
                for call in self.tool_calls
            ]
            return AIMessage(
                **base_args,
                tool_calls=lc_tool_calls
            )
        elif self.role == MessageRole.SYSTEM:
            return SystemMessage(**base_args)
        elif self.role == MessageRole.TOOL:
            return ToolMessage(
                tool_call_id=str(self.tool_call_id),
                **base_args
            )