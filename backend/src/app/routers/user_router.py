from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from src.models.userModels import PortofolioLink
from src.schemas.user_schemas import UserCreate, UserPublic, Token
from src.crud import user_crud
from src.db.database import get_db
from src.core import auth
from src.app.deps import get_current_user_deps, get_db_deps


router = APIRouter(
    # prefix="/",
    tags=["user"],
)

@router.post("/register", response_model=UserPublic)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_username(db=db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    user_registered = user_crud.create_user(db=db, user=user)
    return UserPublic(username=user_registered.username, id=user_registered.id, email=user_registered.email, full_name=user_registered.full_name)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": user.model_dump()}

@router.get("/companies")
def get_all_companies(db: Session = Depends(get_db)):
    companies = user_crud.get_all_companies(db=db)
    return {"companies": companies, "total": len(companies)}

@router.get("/companies/me")
def get_user_portfolio(db : get_db_deps,user : get_current_user_deps):
    companies = user_crud.get_user_company_by_user_id(db=db, user=user)
    return {"companies": companies, "total": len(companies)}

@router.post("/companies/me")
def add_user_portfolio(company: int, db : get_db_deps, user : get_current_user_deps):
    new_portfolio = user_crud.add_user_company(db=db, user_id=user.id, company_id=company)
    return {"new_portfolio": new_portfolio}

@router.delete("/companies/me/{company_id}")
def delete_user_portfolio(company_id: int, db : get_db_deps, user : get_current_user_deps):
    deleted_portfolio = user_crud.delete_user_company(db=db, user_id=user.id, company_id=company_id)
    return {"deleted_portfolio": deleted_portfolio}