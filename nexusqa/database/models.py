"""
NEXUS QA — Database Models (SQLAlchemy ORM)
=============================================
Full schema covering:
  - Scans (orchestrator job records)
  - Findings (all QA issues per scan)
  - Reports (generated report metadata)
  - JIRA Tickets (auto-created ticket refs)
  - SEO Fixes (auto-applied fix records)
  - Agents (which agent ran which test)
  - Users / Projects (multi-tenant support)
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float,
    DateTime, ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


# ── PROJECTS ─────────────────────────────────────────────────
class Project(Base):
    __tablename__ = "projects"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    name        = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    base_url    = Column(String(500), nullable=False)
    jira_key    = Column(String(50), nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    scans = relationship("Scan", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name})>"


# ── SCANS ─────────────────────────────────────────────────────
class Scan(Base):
    __tablename__ = "scans"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    job_id           = Column(String(100), unique=True, nullable=False, index=True)
    project_id       = Column(Integer, ForeignKey("projects.id"), nullable=True)
    target_url       = Column(String(500), nullable=False)
    scan_mode        = Column(String(50), default="full")   # full, seo, security, ui, etc.
    status           = Column(String(50), default="pending") # pending, running, complete, failed
    model_used       = Column(String(100), nullable=True)
    total_pages      = Column(Integer, default=0)
    total_findings   = Column(Integer, default=0)
    critical_count   = Column(Integer, default=0)
    high_count       = Column(Integer, default=0)
    medium_count     = Column(Integer, default=0)
    low_count        = Column(Integer, default=0)
    info_count       = Column(Integer, default=0)
    auto_fixed_count = Column(Integer, default=0)
    duration_seconds = Column(Float, nullable=True)
    token_input      = Column(Integer, default=0)
    token_output     = Column(Integer, default=0)
    token_cached     = Column(Integer, default=0)
    error_message    = Column(Text, nullable=True)
    config           = Column(JSON, nullable=True)
    started_at       = Column(DateTime, default=datetime.utcnow)
    completed_at     = Column(DateTime, nullable=True)
    created_at       = Column(DateTime, default=datetime.utcnow)

    project  = relationship("Project", back_populates="scans")
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")
    reports  = relationship("Report", back_populates="scan", cascade="all, delete-orphan")
    agents   = relationship("AgentRun", back_populates="scan", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Scan(id={self.id}, job_id={self.job_id}, status={self.status})>"


# ── FINDINGS ─────────────────────────────────────────────────
class Finding(Base):
    __tablename__ = "findings"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    scan_id        = Column(Integer, ForeignKey("scans.id"), nullable=False)
    finding_id     = Column(String(50), nullable=True)         # e.g. NQ-001
    category       = Column(String(100), nullable=False)       # security, ui, seo, etc.
    title          = Column(String(500), nullable=False)
    description    = Column(Text, nullable=True)
    severity       = Column(String(50), nullable=False)        # Critical, High, Medium, Low, Info
    url            = Column(String(500), nullable=True)
    selector       = Column(String(500), nullable=True)        # CSS/XPath selector if applicable
    evidence       = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=True)
    cvss_score     = Column(Float, nullable=True)
    wcag_level     = Column(String(10), nullable=True)         # A, AA, AAA
    auto_fixed     = Column(Boolean, default=False)
    fix_content    = Column(Text, nullable=True)
    screenshot_b64 = Column(Text, nullable=True)
    raw_data       = Column(JSON, nullable=True)
    created_at     = Column(DateTime, default=datetime.utcnow)

    scan         = relationship("Scan", back_populates="findings")
    jira_tickets = relationship("JiraTicket", back_populates="finding", cascade="all, delete-orphan")
    seo_fixes    = relationship("SeoFix", back_populates="finding", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Finding(id={self.id}, severity={self.severity}, title={self.title[:40]})>"


# ── JIRA TICKETS ──────────────────────────────────────────────
class JiraTicket(Base):
    __tablename__ = "jira_tickets"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    finding_id  = Column(Integer, ForeignKey("findings.id"), nullable=False)
    scan_id     = Column(Integer, ForeignKey("scans.id"), nullable=False)
    ticket_id   = Column(String(100), nullable=False)           # e.g. NEXUSQA-42
    ticket_url  = Column(String(500), nullable=True)
    issue_type  = Column(String(50), default="Bug")
    priority    = Column(String(50), nullable=True)
    status      = Column(String(50), default="Open")
    duplicate_of= Column(String(100), nullable=True)            # if semantic duplicate found
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    finding = relationship("Finding", back_populates="jira_tickets")

    def __repr__(self):
        return f"<JiraTicket(ticket_id={self.ticket_id})>"


# ── SEO FIXES ─────────────────────────────────────────────────
class SeoFix(Base):
    __tablename__ = "seo_fixes"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    finding_id  = Column(Integer, ForeignKey("findings.id"), nullable=False)
    scan_id     = Column(Integer, ForeignKey("scans.id"), nullable=False)
    fix_type    = Column(String(100), nullable=False)   # meta_title, meta_desc, canonical, etc.
    url         = Column(String(500), nullable=False)
    old_value   = Column(Text, nullable=True)
    new_value   = Column(Text, nullable=True)
    applied     = Column(Boolean, default=False)
    verified    = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.utcnow)

    finding = relationship("Finding", back_populates="seo_fixes")

    def __repr__(self):
        return f"<SeoFix(fix_type={self.fix_type}, url={self.url[:50]})>"


# ── REPORTS ───────────────────────────────────────────────────
class Report(Base):
    __tablename__ = "reports"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    scan_id     = Column(Integer, ForeignKey("scans.id"), nullable=False)
    format      = Column(String(20), nullable=False)     # json, html, pdf, markdown
    file_path   = Column(String(500), nullable=True)
    content     = Column(Text, nullable=True)            # stored inline if small
    size_bytes  = Column(Integer, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="reports")

    def __repr__(self):
        return f"<Report(scan_id={self.scan_id}, format={self.format})>"


# ── AGENT RUNS ───────────────────────────────────────────────
class AgentRun(Base):
    __tablename__ = "agent_runs"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    scan_id        = Column(Integer, ForeignKey("scans.id"), nullable=False)
    agent_name     = Column(String(100), nullable=False)   # ui_agent, seo_agent, etc.
    model_used     = Column(String(100), nullable=True)
    status         = Column(String(50), default="pending")
    tool_calls     = Column(Integer, default=0)
    findings_found = Column(Integer, default=0)
    token_input    = Column(Integer, default=0)
    token_output   = Column(Integer, default=0)
    duration_secs  = Column(Float, nullable=True)
    error          = Column(Text, nullable=True)
    started_at     = Column(DateTime, default=datetime.utcnow)
    completed_at   = Column(DateTime, nullable=True)

    scan = relationship("Scan", back_populates="agents")

    def __repr__(self):
        return f"<AgentRun(agent={self.agent_name}, status={self.status})>"
