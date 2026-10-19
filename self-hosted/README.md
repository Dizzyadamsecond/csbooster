# Cs2Booster Self-Hosted Setup

Run Cs2Booster entirely on your own Windows computer without external services.

## Prerequisites

### Required:
- Windows 10/11 (64-bit)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8) 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads) (optional, for pulling updates)

### Recommended:
- Counter-Strike 2 installed (for optimization features to work)
- 4GB+ RAM
- .NET 8 Runtime (installed automatically by Docker)

## Quick Start

### Option 1: One-Click Setup (Recommended)

1. **PowerShell (Administrator recommended):**
   ```powershell
   # Navigate to project
   cd C:\Caminho\Para\Cs2Booster

   # Execute setup
   .\self-hosted\setup.ps1
   ```

2. **Access the application:**
   - **API (Performance Optimization):** http://localhost:8080
   - **Web UI (Feature Showcase):** http://localhost:3000
   - **Both combined:** Open both URLs in your browser

### Option 2: Manual Setup

#### 1. Build .NET API
```powershell
cd Cs2Booster
dotnet build Cs2Booster/Cs2Booster.csproj -c Release
```

#### 2. Build Next.js Frontend
```powershell
cd packages/web
npm install
npm run build
```

#### 2. Start Docker
```powershell
cd Cs2Booster
docker compose up -d
```

#### 3. Verify
- API: http://localhost:8080/health
- Web: http://localhost:3000

## Features Available (5 Essential)

After running, you can access all features:

1. **Process Priority Optimization** - Set CS2 to Time Critical (the #1 performance feature)
2. **Memory Optimization** - Large pages + working set trim (reduces stuttering)
3. **One-Click Apply/Revert** - Single button optimization (core value prop)
4. **Before/After Comparison** - FPS improvement display (shows tangible benefits)
5. **CS2 Process Detection** - Auto-detect cs2.exe (essential for background operation)

**Removed for v1.0:** Network Optimizer, GPU Optimization, FPS Profiler, Profile Management, Tray Icon, Configuration Dialog, Performance Analytics, JSON Export. These will be added in v2.0 based on user feedback.

**Why 5 features?** Fewer features = faster development = sooner user feedback = better product-market fit. Follow the 5-feature minimum viable product principle.

## Ports Used

| Service | Port | Purpose |
|---------|------|---------|
| Cs2Booster API | 8080 | .NET WPF performance engine |
| Next.js Web | 3000 | Monochromatic UI showcase |
| PostgreSQL (optional) | 5432 | Data storage |

## Managing the Application

### Stop containers:
```powershell
docker compose down
```

### Restart:
```powershell
docker compose restart
```

### View logs:
```powershell
docker compose logs -f
```

## Production Notes

- **Firewall:** Allow ports 8080 and 3000 through Windows Firewall if blocked
- **Auto-start:** Add Docker to Windows startup for persistence
- **Data persistence:** Docker volumes persist data across restarts
- **CS2 required:** Most optimization features require CS2 to be running

## Domain Registration (Optional - csbooster.io)

If you want to access via domain instead of localhost:

1. Register domain at Namecheap/GoDaddy/etc. (~$12/year)
2. Point A record to your computer's public IP
3. Configure router port forwarding:
   - Port 8080 → PC local IP
   - Port 3000 → PC local IP
4. Use `nslookup csbooster.io` to verify

**Note:** Home internet typically has dynamic IP - consider DDNS service (Cloudflare, No-IP).

## License

This project is free for personal use. Commercial use requires reviewing the original code licenses.