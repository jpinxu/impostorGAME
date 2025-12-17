# Build Script para Ejecutable
# Genera ImpostorGameWeb.exe

Write-Host "=== Impostor Game - Build EXE ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "launcher.py")) {
    Write-Host "Error: No se encuentra launcher.py" -ForegroundColor Red
    Write-Host "Ejecuta este script desde la raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Verificar entorno virtual
if (-not (Test-Path ".venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activar entorno
Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
& ".\.venv\Scripts\Activate.ps1"

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements-dev.txt -q

# Limpiar builds anteriores
if (Test-Path "build") {
    Write-Host "Limpiando builds anteriores..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "build"
}

if (Test-Path "dist\ImpostorGameWeb.exe") {
    Write-Host "Eliminando ejecutable anterior..." -ForegroundColor Yellow
    Remove-Item -Force "dist\ImpostorGameWeb.exe"
}

# Crear ejecutable
Write-Host ""
Write-Host "Creando ejecutable..." -ForegroundColor Green
Write-Host "Esto puede tomar 1-2 minutos..." -ForegroundColor Yellow
Write-Host ""

pyinstaller --onefile --windowed `
    --name "ImpostorGameWeb" `
    --add-data "templates;templates" `
    --add-data "static;static" `
    launcher.py

# Verificar resultado
if (Test-Path "dist\ImpostorGameWeb.exe") {
    Write-Host ""
    Write-Host "=== BUILD EXITOSO ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ejecutable creado en: dist\ImpostorGameWeb.exe" -ForegroundColor Cyan
    
    $size = (Get-Item "dist\ImpostorGameWeb.exe").Length / 1MB
    Write-Host "Tamaño: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Puedes compartir este archivo con cualquiera." -ForegroundColor Yellow
    Write-Host "No requiere instalación de Python ni ninguna dependencia." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "=== BUILD FALLIDO ===" -ForegroundColor Red
    Write-Host "Revisa los errores arriba" -ForegroundColor Yellow
    exit 1
}
