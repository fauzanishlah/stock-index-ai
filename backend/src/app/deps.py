from typing import Annotated
from fastapi import Depends
from src.db.database import get_db
from src.core.auth import get_current_user
from src.models.userModels import User
from sqlmodel import Session

get_current_user_deps = Annotated[User, Depends(get_current_user)]
get_db_deps = Annotated[Session, Depends(get_db)]