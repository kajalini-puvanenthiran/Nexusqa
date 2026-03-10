from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid, enum

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    admin  = "admin"
    user   = "user"

class User(Base):
    __tablename__ = "users"
    id            = Column(String(36), primary_key=True, default=gen_uuid)
    full_name     = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    hashed_pw     = Column(String(255), nullable=False)
    role          = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    phone         = Column(String(20), nullable=True)
    profile_image = Column(String(500), nullable=True)
    is_active     = Column(Boolean, default=True)
    reset_token   = Column(String(100), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    scans         = relationship("Scan", back_populates="user", cascade="all,delete")
class Scan(Base):
    __tablename__ = "scans"
    id            = Column(String(36), primary_key=True, default=gen_uuid)
    user_id       = Column(String(36), ForeignKey("users.id"), nullable=False)
    url           = Column(String(500), nullable=False)
    target_type   = Column(String(50), default="website")
    mode          = Column(String(50), default="full")
    status        = Column(String(30), default="pending")   # pending|running|done|failed
    findings      = Column(JSON, default=dict)
    summary       = Column(Text, nullable=True)
    score         = Column(Integer, default=0)
    created_at    = Column(DateTime, default=datetime.utcnow)
    completed_at  = Column(DateTime, nullable=True)
    user          = relationship("User", back_populates="scans")
    reports       = relationship("Report", back_populates="scan", cascade="all,delete")

class Report(Base):
    __tablename__ = "reports"
    id            = Column(String(36), primary_key=True, default=gen_uuid)
    scan_id       = Column(String(36), ForeignKey("scans.id"), nullable=False)
    status        = Column(String(50), default="active") # active|deleted|purchased
    pdf_path      = Column(String(500), nullable=True)
    csv_path      = Column(String(500), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    scan          = relationship("Scan", back_populates="reports")

class SystemConfig(Base):
    __tablename__ = "system_config"
    id            = Column(Integer, primary_key=True)
    site_name     = Column(String(200), default="NEXUS Intelligence Platform")
    site_url      = Column(String(200), default="mindvisionit.com")
    timezone      = Column(String(50),  default="UTC / GMT+5:30")
    hq_location   = Column(String(200), default="Global Nexus Hub")
    active_modules= Column(JSON, default=dict) # e.g. {"seo": true, "qa": true, ...}
    menu_labels   = Column(JSON, default=dict) # e.g. {"home": "Home Hub", ...}
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
