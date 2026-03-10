from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: UserRole = UserRole.user
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class RoleUpdate(BaseModel):
    role: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class ForgotIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    token: str
    password: str
