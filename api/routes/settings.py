from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SystemConfig, User, UserRole
from ..auth import require_admin
from pydantic import BaseModel
from typing import Dict, Optional

router = APIRouter()

class SettingUpdate(BaseModel):
    site_name: Optional[str] = None
    site_url:  Optional[str] = None
    timezone:  Optional[str] = None
    hq_location: Optional[str] = None
    active_modules: Optional[Dict[str, bool]] = None
    menu_labels: Optional[Dict[str, str]] = None

@router.get("/")
def get_settings(db: Session = Depends(get_db)):
    conf = db.query(SystemConfig).first()
    if not conf:
        # Initial seeding of config
        conf = SystemConfig(id=1, active_modules={}, menu_labels={})
        db.add(conf)
        db.commit()
    return conf

@router.put("/", dependencies=[Depends(require_admin)])
def update_settings(data: SettingUpdate, db: Session = Depends(get_db)):
    conf = db.query(SystemConfig).first()
    if not conf:
        conf = SystemConfig(id=1)
        db.add(conf)
    
    if data.site_name is not None: conf.site_name = data.site_name
    if data.site_url is not None:  conf.site_url  = data.site_url
    if data.timezone is not None:  conf.timezone  = data.timezone
    if data.hq_location is not None: conf.hq_location = data.hq_location
    if data.active_modules is not None:
        merged = (conf.active_modules or {}).copy()
        merged.update(data.active_modules)
        conf.active_modules = merged
    if data.menu_labels is not None:
        merged = (conf.menu_labels or {}).copy()
        merged.update(data.menu_labels)
        conf.menu_labels = merged
    
    db.commit()
    db.refresh(conf)
    return conf
