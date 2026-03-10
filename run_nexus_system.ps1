# NEXUS Intelligence Platform - Unified Starter System
Write-Host "--- Launching NEXUS Intelligence Platform ---" -ForegroundColor Cyan

# 1. Verification of Relational Mainland (MySQL)
Write-Host "Checking MySQL Mainframe (Port 5566)..." -ForegroundColor Yellow
$mysqlCheck = Test-NetConnection -ComputerName localhost -Port 5566 -InformationLevel Quiet
if (-not $mysqlCheck) {
    Write-Host "Warning: MySQL is not responding on Port 5566." -ForegroundColor Red
    Write-Host "Please ensure XAMPP MySQL is STARTED and configured on port 5566." -ForegroundColor Gray
}

# 2. Synchronize Backend Registry (8001)
Write-Host "Initializing Backend Intelligence (Port 8001)..." -ForegroundColor Yellow
$oldProc = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
if ($oldProc) {
    Write-Host "Recalibrating Port 8001..." -ForegroundColor Gray
    Stop-Process -Id $oldProc.OwningProcess[0] -Force -ErrorAction SilentlyContinue
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn api.main:app --host 0.0.0.0 --port 8001"

# 3. Initialize Operational Dashboard (5173)
Write-Host "Launching Operational Dashboard..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd dashboard; npm run dev"

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "System Deployment Sequence Commenced." -ForegroundColor Cyan
Write-Host "Dashboard:  http://localhost:5173" -ForegroundColor Green
Write-Host "API Docs:   http://localhost:8001/docs" -ForegroundColor Yellow
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
