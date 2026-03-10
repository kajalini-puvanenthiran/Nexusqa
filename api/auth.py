import os, secrets, bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

SECRET_KEY      = os.getenv("SECRET_KEY", secrets.token_hex(32))
ALGORITHM       = "HS256"
ACCESS_EXPIRE   = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 480))  # 8 hours

oauth2   = OAuth2PasswordBearer(tokenUrl="/auth/token")

def hash_password(pw: str) -> str:
    # bcrypt expects bytes
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire    = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_EXPIRE))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)) -> User:
    exc = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials",
                        headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email: raise exc
    except JWTError:
        raise exc
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user: raise exc
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
