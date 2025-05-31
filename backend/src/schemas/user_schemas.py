from sqlmodel import SQLModel
from typing import List, Optional

class UserCreate(SQLModel):
    username: str
    password: str
    full_name: Optional[str] = ""
    email: Optional[str] = ""


class UserPublic(SQLModel):
    id: int
    username: str
    full_name: Optional[str] = ""
    email: Optional[str] = ""

class Token(SQLModel):
    access_token: str
    token_type: str
    user: UserPublic
