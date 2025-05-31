from fastapi import HTTPException, status
from psycopg import IntegrityError
from sqlmodel import Session, select
from passlib.context import CryptContext
from src.models.userModels import User, Company, PortofolioLink
from src.schemas.user_schemas import UserCreate


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    stmt = select(User).where(User.username == username)
    return db.exec(stmt).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password, full_name=user.full_name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not pwd_context.verify(password, user.hashed_password):
        return None
    return user

def add_company(db: Session, company: Company):
    try:
        db.add(company)
        db.commit()
        db.refresh(company)
        return company
    except Exception as e:
        db.rollback()
        raise e
    
def delete_company(db: Session, company_id: int):
    try:
        stmt = select(Company).where(Company.id == company_id)
        company = db.exec(stmt).first()
        db.delete(company)
        db.commit()
        return company
    except Exception as e:
        db.rollback()
        raise e

def get_company_by_id(db: Session, company_id: int):
    try:
        stmt = select(Company).where(Company.id == company_id)
        return db.exec(stmt).first()
    except Exception as e:
        db.rollback()
        raise e
    
def add_company_link(db: Session, link: PortofolioLink):
    try:
        db.add(link)
        db.commit()
        db.refresh(link)
        return link
    except Exception as e:
        db.rollback()
        raise e 

def delete_company_link(db: Session, link: PortofolioLink):
    try:
        db.delete(link)
        db.commit()
        return link
    except Exception as e:
        db.rollback()

def get_company_links_by_company_id(db: Session, company_id: int):
    try:
        stmt = select(PortofolioLink).where(PortofolioLink.company_id == company_id)
        return db.exec(stmt).all()
    except Exception as e:
        db.rollback()
        raise e
    
def get_company_links_by_user_id(db: Session, user_id: int):
    try:
        stmt = select(PortofolioLink).where(PortofolioLink.user_id == user_id)
        return db.exec(stmt).all()
    except Exception as e:
        db.rollback()
        raise e
    
def get_company_link_by_user_id_and_company_id(db: Session, user_id: int, company_id: int):
    try:
        stmt = select(PortofolioLink).where(PortofolioLink.user_id == user_id, PortofolioLink.company_id == company_id)
        return db.exec(stmt).first()
    except Exception as e:
        db.rollback()
        raise e
    
def get_user_company_by_user_id(db: Session, user_id: int):
    try:
        stmt = select(Company).join(PortofolioLink).where(PortofolioLink.user_id == user_id)
        return db.exec(stmt).all()
    except Exception as e:
        db.rollback()

def get_user_company_by_username(db: Session, username: str):
    try:
        user = get_user_by_username(db, username)
        if not user:
            return None
        stmt = select(Company).join(PortofolioLink).where(PortofolioLink.user_id == user.id)
        return db.exec(stmt).all()
    except Exception as e:
        db.rollback()

def get_all_companies(db: Session):
    try:
        stmt = select(Company)
        return db.exec(stmt).all()
    except Exception as e:
        db.rollback()
        raise e
    
def add_user_company(db: Session, user_id: int, company_id: int):
    try:
        new_portfolio = PortofolioLink(user_id=user_id, company_id=company_id)
        db.add(new_portfolio)
        db.commit()
        db.refresh(new_portfolio)
        return new_portfolio
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already has this company")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
    
def delete_user_company(db: Session, user_id: int, company_id: int):
    try:
        stmt = select(PortofolioLink).where(PortofolioLink.user_id == user_id, PortofolioLink.company_id == company_id)
        link = db.exec(stmt).first()
        if not link:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
        db.delete(link)
        db.commit()
        return link
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")