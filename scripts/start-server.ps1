# Start a clean local static server for Secret Identity.
# Usage: .\scripts\start-server.ps1
# Or from Cursor: Terminal → Run Task… → Start local server

param(
  [int]$Port = 5173
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")

function Stop-ListenersOnPort {
  param([int]$Port)

  $pids = @()
  netstat -ano | ForEach-Object {
    if ($_ -match "^\s*TCP\s+\S+:$Port\s+\S+\s+LISTENING\s+(\d+)\s*$") {
      $pids += [int]$Matches[1]
    }
  }

  foreach ($procId in ($pids | Select-Object -Unique)) {
    Write-Host "Stopping existing process on port $Port (PID $procId)..."
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  }

  if ($pids.Count -gt 0) {
    Start-Sleep -Seconds 1
  }
}

Stop-ListenersOnPort -Port $Port
Set-Location $Root

Write-Host "Serving http://127.0.0.1:$Port/  (Ctrl+C to stop)"
python -m http.server $Port --bind 127.0.0.1
