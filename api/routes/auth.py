import secrets, os
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..database import get_db
from ..models import User, UserRole
from ..auth import (hash_password, verify_password, create_access_token,
                    get_current_user, require_admin)

router = APIRouter()

from ..schemas import UserOut, UserCreate, ForgotIn, ResetIn, ProfileUpdate, PasswordChange

# ── Register ────────────────────────────────────────────────────
@router.post("/register", response_model=UserOut, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(full_name=data.full_name, email=data.email,
                hashed_pw=hash_password(data.password))
    db.add(user); db.commit(); db.refresh(user)
    return user

# ── OAuth Configuration ─────────────────────────────────────────
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from starlette.responses import RedirectResponse

oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}
)

# ── Login (JSON) ────────────────────────────────────────────────
class LoginIn(BaseModel):
    email:    EmailStr
    password: str

@router.post("/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.is_active == True).first()
    if not user or not verify_password(data.password, user.hashed_pw):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "role": user.role}

# ── Social OAuth Login Handle ───────────────────────────────────
@router.get("/login/{provider}")
async def social_login(provider: str, req: Request, db: Session = Depends(get_db)):
    if provider not in ["google", "github", "phone"]:
        raise HTTPException(400, "Invalid provider")
    
    # Check if configured, otherwise mock for UX
    is_configured = os.getenv(f"{provider.upper()}_CLIENT_ID")
    
    if not is_configured or provider == "phone":
        # Mock login for development/demo
        email = f"demo_{provider}@nexusqa.com"
        user  = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(full_name=f"Demo {provider.capitalize()}", email=email,
                        hashed_pw=hash_password("demo_pass"), role=UserRole.user)
            db.add(user); db.commit(); db.refresh(user)
        
        access_token = create_access_token({"sub": user.email})
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(f"{frontend_url}/auth/callback?token={access_token}&role={user.role}&name={user.full_name}")

    redirect_uri = f"{req.base_url}auth/callback/{provider}"
    return await getattr(oauth, provider).authorize_redirect(req, redirect_uri)

@router.get("/callback/{provider}")
async def social_callback(provider: str, req: Request, db: Session = Depends(get_db)):
    if provider not in ["google", "github"]:
        raise HTTPException(400, "Invalid provider")
    
    token_resp = await getattr(oauth, provider).authorize_access_token(req)
    user_info = token_resp.get('userinfo')
    
    if provider == 'github':
        # GitHub manual user info fetch if not in userinfo
        resp = await oauth.github.get('user', token=token_resp)
        user_info = resp.json()
        email = user_info.get('email')
        if not email:
            # Fallback to fetching email list
            emails = await oauth.github.get('user/emails', token=token_resp)
            email = next(e['email'] for e in emails.json() if e['primary'])
        user_info['email'] = email
        user_info['name']  = user_info.get('name', user_info.get('login'))

    email = user_info.get('email')
    user  = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Auto-register new social user
        user = User(full_name=user_info.get('name', 'Social User'), email=email,
                    hashed_pw=hash_password(secrets.token_hex(16)), 
                    role=UserRole.user)
        db.add(user); db.commit(); db.refresh(user)

    access_token = create_access_token({"sub": user.email})
    # Redirect to frontend with token
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(f"{frontend_url}/auth/callback?token={access_token}&role={user.role}&name={user.full_name}")

# ── OAuth2 form login (for /docs) ───────────────────────────────
@router.post("/token")
def token_login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username, User.is_active == True).first()
    if not user or not verify_password(form.password, user.hashed_pw):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# ── Me ──────────────────────────────────────────────────────────
@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user

# ── Logout (stateless — client drops token) ─────────────────────
@router.post("/logout")
def logout():
    return {"ok": True}

# ── Profile Update ──────────────────────────────────────────────
@router.put("/profile", response_model=UserOut)
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), 
                   user: User = Depends(get_current_user)):
    if data.full_name is not None: user.full_name = data.full_name
    if data.email is not None:
        # Check if email taken by someone else
        existing = db.query(User).filter(User.email == data.email, User.id != user.id).first()
        if existing: raise HTTPException(400, "Email already in use")
        user.email = data.email
    if data.phone is not None: user.phone = data.phone
    db.commit(); db.refresh(user)
    return user

# ── Password Change ─────────────────────────────────────────────
@router.post("/change-password")
def change_password(data: PasswordChange, db: Session = Depends(get_db),
                   user: User = Depends(get_current_user)):
    if not verify_password(data.old_password, user.hashed_pw):
        raise HTTPException(400, "Incorrect old password")
    user.hashed_pw = hash_password(data.new_password)
    db.commit()
    return {"ok": True}

# ── Forgot Password ─────────────────────────────────────────────
@router.post("/forgot-password")
def forgot_password(data: ForgotIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        db.commit()
        # TODO: send email via aiosmtplib
        print(f"[DEV] Password reset token for {data.email}: {token}")
    # Always return OK to prevent user enumeration
    return {"ok": True, "message": "If the email exists, a reset link has been sent."}

# ── Reset Password ──────────────────────────────────────────────
@router.post("/reset-password")
def reset_password(data: ResetIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == data.token).first()
    if not user:
        raise HTTPException(400, "Invalid or expired token")
    user.hashed_pw  = hash_password(data.password)
    user.reset_token= None
    db.commit()
    return {"ok": True}
