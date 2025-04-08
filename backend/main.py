from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
import uvicorn
import traceback

from app.database import get_db, init_db
from app.models import Base
from app.schemas import UserCreate, UserLogin, UserResponse, PostCreate, PostResponse
from app.crud import create_user, authenticate_user, get_user_posts, create_post, create_default_user
from app.auth import create_access_token, get_current_user

app = FastAPI(title="AI Social Network API", debug=True)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error handler for all exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = f"An error occurred: {str(exc)}\n{traceback.format_exc()}"
    print(error_msg)  # Print to console for debugging
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

# Initialize database and create default user
@app.on_event("startup")
async def startup_event():
    init_db()
    db = next(get_db())
    try:
        create_default_user(db)
    except Exception as e:
        print(f"Error creating default user: {e}")

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = create_user(db, user)
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        user = authenticate_user(db, user_credentials)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )
        access_token = create_access_token(data={"sub": user.email})
        return {"token": access_token, "user": UserResponse.from_orm(user)}
    except Exception as e:
        print(f"Login error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/posts", response_model=List[PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        posts = get_user_posts(db)
        return posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/posts", response_model=PostResponse)
def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return create_post(db, post, current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/profile", response_model=UserResponse)
def get_profile(current_user = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 