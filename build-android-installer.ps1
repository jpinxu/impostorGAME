# Script para crear instalador EXE de Android
Write-Host "=== Creando Instalador Android ===" -ForegroundColor Cyan
Write-Host ""

# Activar entorno virtual
if (Test-Path ".venv\Scripts\Activate.ps1") {
    & ".\.venv\Scripts\Activate.ps1"
}

# Crear instalador EXE
Write-Host "Creando instalador..." -ForegroundColor Yellow
pyinstaller --onefile --windowed=False `
    --name "ImpostorGameAndroidInstaller" `
    --icon "icon.ico" `
    --add-data "dist-android\ImpostorGame.apk;." `
    android_installer.py

if (Test-Path "dist\ImpostorGameAndroidInstaller.exe") {
    Write-Host ""
    Write-Host "=== BUILD EXITOSO ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Instalador creado en: dist\ImpostorGameAndroidInstaller.exe" -ForegroundColor Cyan
    
    $size = (Get-Item "dist\ImpostorGameAndroidInstaller.exe").Length / 1MB
    Write-Host "Tamaño: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USO:" -ForegroundColor Yellow
    Write-Host "1. Ejecuta ImpostorGameAndroidInstaller.exe" -ForegroundColor White
    Write-Host "2. Conecta tu dispositivo Android" -ForegroundColor White
    Write-Host "3. El instalador descargará ADB y instalará la app" -ForegroundColor White
} else {
    Write-Host "=== BUILD FALLIDO ===" -ForegroundColor Red
}
