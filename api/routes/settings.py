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
    menu_config: Optional[Dict[str, Dict]] = None
    role_configs: Optional[Dict[str, Dict]] = None
    company_name: Optional[str] = None
    operational_site: Optional[str] = None
    industry: Optional[str] = None
    contact_email: Optional[str] = None
    support_phone: Optional[str] = None
    theme_settings: Optional[Dict] = None
    roles_metadata: Optional[List[Dict]] = None

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
    try:
        conf = db.query(SystemConfig).first()
        if not conf:
            conf = SystemConfig(id=1)
            db.add(conf)
            db.commit()
            db.refresh(conf)
        
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
        
        if data.menu_config is not None:
            merged = (conf.menu_config or {}).copy()
            merged.update(data.menu_config)
            conf.menu_config = merged

        if data.role_configs is not None:
            merged = (conf.role_configs or {}).copy()
            merged.update(data.role_configs)
            conf.role_configs = merged
        
        if data.company_name is not None: conf.company_name = data.company_name
        if data.operational_site is not None: conf.operational_site = data.operational_site
        if data.industry is not None: conf.industry = data.industry
        if data.contact_email is not None: conf.contact_email = data.contact_email
        if data.support_phone is not None: conf.support_phone = data.support_phone
        
        if data.theme_settings is not None:
            merged = (conf.theme_settings or {}).copy()
            merged.update(data.theme_settings)
            conf.theme_settings = merged
        
        if data.roles_metadata is not None:
            conf.roles_metadata = data.roles_metadata
        
        db.commit()
        db.refresh(conf)
        return conf
    except Exception as e:
        db.rollback()
        print(f"[SETTINGS ERROR] {e}", flush=True)
        raise HTTPException(status_code=500, detail=f"Core Sync Failure: {str(e)}")
