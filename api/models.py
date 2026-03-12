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
    lead   = "lead"
    user   = "user"

class User(Base):
    __tablename__ = "users"
    id            = Column(String(36), primary_key=True, default=gen_uuid)
    full_name     = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    hashed_pw     = Column(String(255), nullable=False)
    role          = Column(String(50), default="user", nullable=False)
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
    credentials   = Column(JSON, nullable=True)
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
    company_name  = Column(String(200), default="Clustersco")
    site_name     = Column(String(200), default="NEXUS Intelligence Platform")
    site_url      = Column(String(200), default="nexusqa.com")
    operational_site = Column(String(100), default="ERP")
    timezone      = Column(String(50),  default="IST / GMT+5:30 (Sri Lanka)")
    hq_location   = Column(String(200), default="Colombo, Sri Lanka")
    contact_email = Column(String(100), default="contact@clustersco.com")
    support_phone = Column(String(50),  default="+94 11 123 4567")
    industry      = Column(String(100), default="Enterprise Solutions")
    branding_primary = Column(String(7), default="#00e5ff")
    active_modules= Column(JSON, default=dict) # e.g. {"seo": true, "qa": true, ...}
    menu_labels   = Column(JSON, default=dict) # e.g. {"home": "Home Hub", ...}
    menu_config   = Column(JSON, default=dict) # e.g. {"home": {"permission": "all", "visible": true}}
    role_configs  = Column(JSON, default=dict) # Granular feature permissions per role
    theme_settings = Column(JSON, default=dict) # Granular theme overrides
    roles_metadata = Column(JSON, default=list) # Custom defined roles
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
