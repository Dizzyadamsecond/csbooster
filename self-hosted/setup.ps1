<#
.SYNOPSIS
Setup script for self-hosted Cs2Booster application
#>

Write-Host "=== Cs2Booster Self-Hosted Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$dotnetVersion = dotnet --version 2>$null
if (-not $dotnetVersion) {
    Write-Host "❌ .NET 8 SDK not found. Install from: https://dotnet.microsoft.com/download/dotnet/8" -ForegroundColor Red
    exit 1
}
Write-Host "✅ .NET 8 SDK: $dotnetVersion" -ForegroundColor Green

$dockerVersion = docker --version 2>$null
if (-not $dockerVersion) {
    Write-Host "❌ Docker not found. Install from: https://docker.com" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green

Write-Host ""

Write-Host "Building Cs2Booster API..." -ForegroundColor Yellow

# Build the .NET project
Push-Location "Cs2Booster"
dotnet build Cs2Booster.csproj -c Release 2>&1
$buildResult = $LASTEXITCODE
Pop-Location

if ($buildResult -ne 0) {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Cs2Booster API built successfully" -ForegroundColor Green

Write-Host ""

Write-Host "Building Next.js frontend..." -ForegroundColor Yellow

Push-Location "packages/web"
if (Test-Path "node_modules") {
    Write-Host "📦 Node modules already installed" -ForegroundColor Yellow
} else {
    Write-Host "📦 Installing npm dependencies..." -ForegroundColor Cyan
    npm install 2>&1 | Write-Progress -ParameterName "npm_install" -ForegroundColor Gray
}

npm run build 2>&1 | Write-Progress -ParameterName "npm_build" -ForegroundColor Gray
$npmResult = $LASTEXITCODE
Pop-Location

if ($npmResult -ne 0) {
    Write-Host "❌ Next.js build failed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Next.js frontend built successfully" -ForegroundColor Green

Write-Host ""

Write-Host "Starting Docker containers..." -ForegroundColor Yellow

Push-Location "."
docker compose up -d 2>&1 | Write-Progress -ParameterName "docker_up" -ForegroundColor Gray
$dockerResult = $LASTEXITCODE
Pop-Location

if ($dockerResult -ne 0) {
    Write-Host "❌ Docker compose failed. Check if Docker is running." -ForegroundColor Red
    exit 1
}

Write-Host ""

Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Access points:" -ForegroundColor White
Write-Host "  • API:      http://localhost:8080" -ForegroundColor Gray
Write-Host "  • Web UI:   http://localhost:3000" -ForegroundColor Gray
Write-Host "  • Features: 5 essential optimization features" -ForegroundColor Gray
Write-Host ""

Write-Host "Prerequisites for full functionality:" -ForegroundColor White
Write-Host "  • CS2 installed on this system" -ForegroundColor Gray
Write-Host "  • .NET 8 Runtime installed" -ForegroundColor Gray
Write-Host "  • Docker running" -ForegroundColor Gray
Write-Host ""

Write-Host "Quick tests:" -ForegroundColor White
Write-Host "  • Test API:     curl http://localhost:8080/health" -ForegroundColor Gray
Write-Host "  • Test Web:     Open http://localhost:3000 in browser" -ForegroundColor Gray
Write-Host "  • View logs:    docker compose logs -f" -ForegroundColor Gray
Write-Host "",
Write-Host "Essential features accessible:" -ForegroundColor White
Write-Host "  • Process Priority: Check CS2 process priority" -ForegroundColor Gray
Write-Host "  • Memory Opt:   Check large page status" -ForegroundColor Gray
Write-Host "  • One-Click:    Click Apply/Revert buttons" -ForegroundColor Gray
Write-Host "  • Before/After: View FPS comparison display" -ForegroundColor Gray
Write-Host "  • Process Detect: Verify cs2.exe detection" -ForegroundColor Gray