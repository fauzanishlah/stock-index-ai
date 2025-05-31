from uuid import UUID
from uuid_extensions import uuid7
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class AgentRequest(BaseModel):
    session_id: Optional[UUID] = Field(default_factory=uuid7, description="Unique identifier for the chat session")
    message: str = Field(..., description="The message to be sent in the chat session")