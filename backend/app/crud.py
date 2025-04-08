from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    if get_user_by_email(db, user.email):
        raise ValueError("Email already registered")
    if get_user_by_username(db, user.username):
        raise ValueError("Username already taken")
        
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_default_user(db: Session):
    # Check if default user exists
    default_email = "admin@example.com"
    default_user = get_user_by_email(db, default_email)
    if not default_user:
        # Create default user
        hashed_password = get_password_hash("admin123")
        default_user = models.User(
            email=default_email,
            username="admin",
            hashed_password=hashed_password,
            bio="Default admin account"
        )
        db.add(default_user)
        db.commit()
        db.refresh(default_user)
    return default_user

def authenticate_user(db: Session, user_credentials: schemas.UserLogin):
    user = get_user_by_email(db, user_credentials.email)
    if not user:
        return None
    if not verify_password(user_credentials.password, user.hashed_password):
        return None
    return user

def get_user_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

def create_post(db: Session, post: schemas.PostCreate, current_user: models.User):
    db_post = models.Post(
        content=post.content,
        author_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_user_profile(db: Session, user: models.User, bio: str):
    user.bio = bio
    db.commit()
    db.refresh(user)
    return user 