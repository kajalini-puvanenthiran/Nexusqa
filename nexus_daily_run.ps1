# NEXUS QA Automation Script
Write-Host "--- NEXUS DAILY RUN ---" -ForegroundColor Cyan

# 1. Start APIs
$api = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
if (!$api) { Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn api.main:app --host 0.0.0.0 --port 8001" }

$ui = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if (!$ui) { Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd dashboard; npm run dev" }

Write-Host "Waiting for services..."
Start-Sleep -Seconds 10

# 2. Run Script
python scripts/nexus_automation_script.py

Write-Host "--- DONE ---" -ForegroundColor Green
