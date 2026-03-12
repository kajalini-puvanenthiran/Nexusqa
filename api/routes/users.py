from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from ..database import get_db
from ..models import User, UserRole
from ..auth import get_current_user, require_admin, hash_password

router = APIRouter()

from ..schemas import UserOut, UserUpdate, RoleUpdate, UserCreate

@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.post("/", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing: raise HTTPException(400, "Email already registered")
    user = User(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        hashed_pw=hash_password(data.password),
        role=data.role,
        is_active=data.is_active
    )
    db.add(user); db.commit(); db.refresh(user)
    return user

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: str, data: UserUpdate, db: Session = Depends(get_db),
                current: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "User not found")
    if current.role != "admin" and current.id != user_id:
        raise HTTPException(403, "Cannot update another user's profile")
    if data.full_name is not None: user.full_name = data.full_name
    if data.email is not None:     user.email     = data.email
    if data.phone is not None:     user.phone     = data.phone
    if data.password:  user.hashed_pw = hash_password(data.password)
    # Check if is_active is in data (need to update UserUpdate schema for this)
    db.commit(); db.refresh(user)
    return user

@router.patch("/{user_id}/status", response_model=UserOut)
def toggle_status(user_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "User not found")
    user.is_active = not user.is_active
    db.commit(); db.refresh(user)
    return user

@router.patch("/{user_id}/role", response_model=UserOut)
def update_role(user_id: str, data: RoleUpdate, db: Session = Depends(get_db),
                _: User = Depends(require_admin)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user: raise HTTPException(404, "User not found")
        user.role = data.role
        db.commit(); db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        print(f"[ROLE UPDATE ERROR] {e}", flush=True)
        raise HTTPException(status_code=500, detail=f"Role assignment failure: {str(e)}")

@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "User not found")
    db.delete(user); db.commit()
    return {"ok": True}
