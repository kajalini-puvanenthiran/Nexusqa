# NEXUS QA Local Runner (No Docker Fallback)
Write-Host "--- NEXUS QA Local Runner ---" -ForegroundColor Cyan

# 1. Kill existing processes
try { Stop-Process -Name uvicorn -ErrorAction SilentlyContinue } catch {}
try { Stop-Process -Name node -ErrorAction SilentlyContinue } catch {}

# Start Backend
Write-Host "Starting API Backend on http://localhost:8001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn api.main:app --host 0.0.0.0 --port 8001"

# Start Frontend
Write-Host "Starting Dashboard on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd dashboard; npm run dev"

Write-Host "System is starting. Open http://localhost:5173" -ForegroundColor Cyan
