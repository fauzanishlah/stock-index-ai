from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class PortofolioLink(SQLModel, table=True):
    user_id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    company_id: int = Field(default=None, foreign_key="company.id", primary_key=True)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    full_name: Optional[str] = None
    email: Optional[str] = None

    companies: Optional[List["Company"]] = Relationship(back_populates="users", link_model=PortofolioLink)


# class Portofolio(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str
#     description: str
#     user_id: int = Field(foreign_key="user.id")
#     user: User = Relationship(back_populates="portofolio")

class Company(SQLModel, table=True):
    __tablename__ = "company"
    id: Optional[int] = Field(default=None, primary_key=True)
    ticker: str = Field(index=True)
    name: str
    exchange: str
    currency: str
    country: str
    sector: str
    industry: str

    users: Optional[List[User]] = Relationship(back_populates="companies", link_model=PortofolioLink)


