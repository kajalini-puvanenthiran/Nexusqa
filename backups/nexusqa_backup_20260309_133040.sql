BEGIN TRANSACTION;
CREATE TABLE agent_runs (
	id INTEGER NOT NULL, 
	scan_id INTEGER NOT NULL, 
	agent_name VARCHAR(100) NOT NULL, 
	model_used VARCHAR(100), 
	status VARCHAR(50), 
	tool_calls INTEGER, 
	findings_found INTEGER, 
	token_input INTEGER, 
	token_output INTEGER, 
	duration_secs FLOAT, 
	error TEXT, 
	started_at DATETIME, 
	completed_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(scan_id) REFERENCES scans (id)
);
INSERT INTO "agent_runs" VALUES(1,1,'ui_agent','claude-opus-4-5','complete',3,1,800,400,4.5,'','2026-03-09 07:45:34.945573','2026-03-09 07:45:34.955704');
INSERT INTO "agent_runs" VALUES(2,1,'security_agent','claude-opus-4-5','complete',3,1,800,400,4.5,'','2026-03-09 07:45:34.965858','2026-03-09 07:45:34.974511');
INSERT INTO "agent_runs" VALUES(3,1,'performance_agent','claude-sonnet-4-5','complete',3,1,800,400,4.5,'','2026-03-09 07:45:34.984179','2026-03-09 07:45:34.992272');
INSERT INTO "agent_runs" VALUES(4,1,'seo_agent','claude-haiku-4-5','complete',3,1,800,400,4.5,'','2026-03-09 07:45:35.000978','2026-03-09 07:45:35.008893');
INSERT INTO "agent_runs" VALUES(5,1,'accessibility_agent','claude-sonnet-4-5','complete',3,1,800,400,4.5,'','2026-03-09 07:45:35.018235','2026-03-09 07:45:35.027269');
CREATE TABLE findings (
	id INTEGER NOT NULL, 
	scan_id INTEGER NOT NULL, 
	finding_id VARCHAR(50), 
	category VARCHAR(100) NOT NULL, 
	title VARCHAR(500) NOT NULL, 
	description TEXT, 
	severity VARCHAR(50) NOT NULL, 
	url VARCHAR(500), 
	selector VARCHAR(500), 
	evidence TEXT, 
	recommendation TEXT, 
	cvss_score FLOAT, 
	wcag_level VARCHAR(10), 
	auto_fixed BOOLEAN, 
	fix_content TEXT, 
	screenshot_b64 TEXT, 
	raw_data JSON, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(scan_id) REFERENCES scans (id)
);
INSERT INTO "findings" VALUES(1,1,NULL,'security','Missing X-Frame-Options Security Header',NULL,'Medium','https://example.com',NULL,'HTTP response does not include X-Frame-Options header, enabling clickjacking attacks.','Add response header: X-Frame-Options: SAMEORIGIN',NULL,NULL,0,NULL,NULL,NULL,'2026-03-09 07:45:35.035985');
INSERT INTO "findings" VALUES(2,1,NULL,'seo','Missing Meta Description on Homepage',NULL,'High','https://example.com',NULL,'The homepage has no <meta name=''description''> tag. This reduces CTR in search results.','Add a compelling 150-160 character meta description targeting primary keywords.',NULL,NULL,1,'<meta name=''description'' content=''Example — The best platform for demos and testing. Try for free today.''>',NULL,NULL,'2026-03-09 07:45:35.045836');
INSERT INTO "findings" VALUES(3,1,NULL,'performance','Largest Contentful Paint (LCP) > 2.5s',NULL,'High','https://example.com',NULL,'LCP measured at 3.2s (threshold: 2.5s). Main hero image is unoptimized (2.4MB PNG).','Convert hero image to WebP, add loading=''lazy'' to off-screen images, preload critical assets.',NULL,NULL,0,NULL,NULL,NULL,'2026-03-09 07:45:35.054156');
INSERT INTO "findings" VALUES(4,1,NULL,'accessibility','Color Contrast Ratio Below WCAG AA (3.2:1 vs 4.5:1 required)',NULL,'High','https://example.com',NULL,'Nav link text (#aaa on #fff) has contrast ratio of 3.2:1. WCAG 2.1 AA requires 4.5:1.','Change nav link color to #767676 or darker for WCAG AA compliance.',NULL,'AA',0,NULL,NULL,NULL,'2026-03-09 07:45:35.063641');
INSERT INTO "findings" VALUES(5,1,NULL,'ui','Contact Form Submit Button Does Nothing on Mobile',NULL,'Critical','https://example.com/contact',NULL,'Tapping ''Submit'' on iPhone 14 (iOS 17, Safari) does not submit form. Console error: Cannot read properties of null (reading ''addEventListener'').','Wrap event listener code in DOMContentLoaded. Ensure IDs match between HTML and JS.',NULL,NULL,0,NULL,NULL,NULL,'2026-03-09 07:45:35.071742');
INSERT INTO "findings" VALUES(6,1,NULL,'seo','4 Images Missing Alt Text',NULL,'Medium','https://example.com/about',NULL,'4 <img> tags have empty or missing alt attributes on the /about page.','Add descriptive, keyword-aware alt text to all images.',NULL,NULL,1,NULL,NULL,NULL,'2026-03-09 07:45:35.081340');
CREATE TABLE jira_tickets (
	id INTEGER NOT NULL, 
	finding_id INTEGER NOT NULL, 
	scan_id INTEGER NOT NULL, 
	ticket_id VARCHAR(100) NOT NULL, 
	ticket_url VARCHAR(500), 
	issue_type VARCHAR(50), 
	priority VARCHAR(50), 
	status VARCHAR(50), 
	duplicate_of VARCHAR(100), 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(finding_id) REFERENCES findings (id), 
	FOREIGN KEY(scan_id) REFERENCES scans (id)
);
INSERT INTO "jira_tickets" VALUES(1,2,1,'NEXUSQA-101','https://clustersco.atlassian.net/browse/NEXUSQA-101','Bug',NULL,'Open',NULL,'2026-03-09 07:45:35.094716','2026-03-09 07:45:35.094716');
INSERT INTO "jira_tickets" VALUES(2,3,1,'NEXUSQA-102','https://clustersco.atlassian.net/browse/NEXUSQA-102','Bug',NULL,'Open',NULL,'2026-03-09 07:45:35.109465','2026-03-09 07:45:35.109465');
INSERT INTO "jira_tickets" VALUES(3,4,1,'NEXUSQA-103','https://clustersco.atlassian.net/browse/NEXUSQA-103','Bug',NULL,'Open',NULL,'2026-03-09 07:45:35.117806','2026-03-09 07:45:35.117806');
INSERT INTO "jira_tickets" VALUES(4,5,1,'NEXUSQA-104','https://clustersco.atlassian.net/browse/NEXUSQA-104','Bug',NULL,'Open',NULL,'2026-03-09 07:45:35.128005','2026-03-09 07:45:35.128005');
CREATE TABLE projects (
	id INTEGER NOT NULL, 
	name VARCHAR(200) NOT NULL, 
	description TEXT, 
	base_url VARCHAR(500) NOT NULL, 
	jira_key VARCHAR(50), 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "projects" VALUES(1,'Sample Web App','Demo project for NEXUS QA','https://example.com','NEXUSQA','2026-03-09 07:45:34.908822','2026-03-09 07:45:34.908822');
INSERT INTO "projects" VALUES(2,'Sample Web App','Demo project for NEXUS QA','https://example.com','NEXUSQA','2026-03-09 08:00:28.835953','2026-03-09 08:00:28.835953');
CREATE TABLE reports (
	id INTEGER NOT NULL, 
	scan_id INTEGER NOT NULL, 
	format VARCHAR(20) NOT NULL, 
	file_path VARCHAR(500), 
	content TEXT, 
	size_bytes INTEGER, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(scan_id) REFERENCES scans (id)
);
INSERT INTO "reports" VALUES(1,1,'json','','{
  "scan_id": "demo-scan-001",
  "target": "https://example.com",
  "total_findings": 6,
  "critical": 1,
  "high": 3,
  "medium": 2,
  "low": 0,
  "auto_fixed": 2,
  "jira_tickets": [
    "NEXUSQA-100",
    "NEXUSQA-101",
    "NEXUSQA-102",
    "NEXUSQA-103"
  ],
  "generated_at": "2026-03-09T07:45:35.162237"
}',314,'2026-03-09 07:45:35.162753');
CREATE TABLE scans (
	id INTEGER NOT NULL, 
	job_id VARCHAR(100) NOT NULL, 
	project_id INTEGER, 
	target_url VARCHAR(500) NOT NULL, 
	scan_mode VARCHAR(50), 
	status VARCHAR(50), 
	model_used VARCHAR(100), 
	total_pages INTEGER, 
	total_findings INTEGER, 
	critical_count INTEGER, 
	high_count INTEGER, 
	medium_count INTEGER, 
	low_count INTEGER, 
	info_count INTEGER, 
	auto_fixed_count INTEGER, 
	duration_seconds FLOAT, 
	token_input INTEGER, 
	token_output INTEGER, 
	token_cached INTEGER, 
	error_message TEXT, 
	config JSON, 
	started_at DATETIME, 
	completed_at DATETIME, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(project_id) REFERENCES projects (id)
);
INSERT INTO "scans" VALUES(1,'demo-scan-001',1,'https://example.com','full','complete',NULL,0,6,1,3,2,0,0,2,47.3,0,0,0,NULL,'{"enable_computer_use": true, "enable_extended_thinking": false}','2026-03-09 07:45:34.923135','2026-03-09 07:45:35.175101','2026-03-09 07:45:34.923135');
CREATE TABLE seo_fixes (
	id INTEGER NOT NULL, 
	finding_id INTEGER NOT NULL, 
	scan_id INTEGER NOT NULL, 
	fix_type VARCHAR(100) NOT NULL, 
	url VARCHAR(500) NOT NULL, 
	old_value TEXT, 
	new_value TEXT, 
	applied BOOLEAN, 
	verified BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(finding_id) REFERENCES findings (id), 
	FOREIGN KEY(scan_id) REFERENCES scans (id)
);
INSERT INTO "seo_fixes" VALUES(1,2,1,'meta_desc','https://example.com','(missing)','<meta name=''description'' content=''Example — The best platform for demos and testing. Try for free today.''>',1,0,'2026-03-09 07:45:35.141219');
INSERT INTO "seo_fixes" VALUES(2,6,1,'alt_text','https://example.com/about','(missing)','auto-generated',1,0,'2026-03-09 07:45:35.151824');
CREATE UNIQUE INDEX ix_scans_job_id ON scans (job_id);
COMMIT;
