from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    bio: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PostBase(BaseModel):
    content: str

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    created_at: datetime
    author_id: int
    likes: int
    comments: int
    author: UserResponse
    model_config = ConfigDict(from_attributes=True) 