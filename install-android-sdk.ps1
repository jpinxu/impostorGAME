# Instalador automatizado de Android SDK para Cordova
Write-Host "=== Instalador Android SDK ===" -ForegroundColor Cyan
Write-Host ""

$androidPath = "C:\Android"
$sdkPath = "$androidPath\sdk"

# Crear directorios
Write-Host "1. Creando directorios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $androidPath -Force | Out-Null
New-Item -ItemType Directory -Path $sdkPath -Force | Out-Null

# Descargar Command Line Tools
Write-Host "2. Descargando Android Command Line Tools..." -ForegroundColor Yellow
$toolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$toolsZip = "$androidPath\cmdline-tools.zip"

try {
    Invoke-WebRequest -Uri $toolsUrl -OutFile $toolsZip -UseBasicParsing
    Write-Host "[OK] Descarga completa" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo descargar: $_" -ForegroundColor Red
    exit 1
}

# Extraer
Write-Host "3. Extrayendo archivos..." -ForegroundColor Yellow
Expand-Archive -Path $toolsZip -DestinationPath "$sdkPath\cmdline-tools-temp" -Force
Remove-Item $toolsZip

# Reorganizar estructura (SDK espera carpeta 'latest')
if (Test-Path "$sdkPath\cmdline-tools-temp\cmdline-tools") {
    New-Item -ItemType Directory -Path "$sdkPath\cmdline-tools\latest" -Force | Out-Null
    Move-Item "$sdkPath\cmdline-tools-temp\cmdline-tools\*" "$sdkPath\cmdline-tools\latest\" -Force
    Remove-Item "$sdkPath\cmdline-tools-temp" -Recurse -Force
}

Write-Host "[OK] Command Line Tools instalado" -ForegroundColor Green

# Configurar variables de entorno
Write-Host "4. Configurando variables de entorno..." -ForegroundColor Yellow

[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdkPath, "User")

$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPaths = @(
    "$sdkPath\cmdline-tools\latest\bin",
    "$sdkPath\platform-tools",
    "$sdkPath\build-tools\35.0.0"
)

foreach ($newPath in $newPaths) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath = "$currentPath;$newPath"
    }
}

[System.Environment]::SetEnvironmentVariable("Path", $currentPath, "User")

# Actualizar variables en sesión actual
$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath
$env:Path = "$env:Path;$sdkPath\cmdline-tools\latest\bin;$sdkPath\platform-tools;$sdkPath\build-tools\35.0.0"

Write-Host "[OK] Variables configuradas" -ForegroundColor Green

# Instalar componentes SDK
Write-Host "5. Instalando componentes Android SDK..." -ForegroundColor Yellow
Write-Host "   Esto puede tomar 5-10 minutos..." -ForegroundColor Yellow
Write-Host ""

$sdkmanager = "$sdkPath\cmdline-tools\latest\bin\sdkmanager.bat"

# Aceptar licencias
Write-Host "   Aceptando licencias..." -ForegroundColor Cyan
echo "y" | & $sdkmanager --licenses 2>&1 | Out-Null

# Instalar componentes necesarios
Write-Host "   Instalando Platform Tools..." -ForegroundColor Cyan
& $sdkmanager "platform-tools" --verbose

Write-Host "   Instalando Build Tools 35.0.0..." -ForegroundColor Cyan
& $sdkmanager "build-tools;35.0.0" --verbose

Write-Host "   Instalando Android Platform 35..." -ForegroundColor Cyan
& $sdkmanager "platforms;android-35" --verbose

Write-Host "   Instalando extras..." -ForegroundColor Cyan
& $sdkmanager "extras;android;m2repository" "extras;google;m2repository" --verbose

Write-Host ""
Write-Host "[OK] Componentes instalados" -ForegroundColor Green

# Verificar Java
Write-Host "6. Verificando Java..." -ForegroundColor Yellow
$javaHome = [System.Environment]::GetEnvironmentVariable("JAVA_HOME", "Machine")

if (-not $javaHome) {
    # Detectar Java instalado
    $javaPath = (Get-Command java -ErrorAction SilentlyContinue).Source
    if ($javaPath) {
        $javaHome = (Get-Item $javaPath).Directory.Parent.FullName
        Write-Host "   Java encontrado en: $javaHome" -ForegroundColor Cyan
        [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "User")
        $env:JAVA_HOME = $javaHome
        Write-Host "[OK] JAVA_HOME configurado" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Java no encontrado en PATH" -ForegroundColor Yellow
        Write-Host "   Configurando JAVA_HOME manualmente..." -ForegroundColor Yellow
        
        # Buscar instalación de Java
        $possiblePaths = @(
            "C:\Program Files\Java\jdk-25",
            "C:\Program Files\Java\jdk-21",
            "C:\Program Files\Java\jdk-17",
            "C:\Program Files\Java\jdk-11"
        )
        
        foreach ($path in $possiblePaths) {
            if (Test-Path $path) {
                [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $path, "User")
                $env:JAVA_HOME = $path
                Write-Host "[OK] JAVA_HOME: $path" -ForegroundColor Green
                break
            }
        }
    }
}

# Resumen
Write-Host ""
Write-Host "=== INSTALACION COMPLETA ===" -ForegroundColor Green
Write-Host ""
Write-Host "Android SDK instalado en: $sdkPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Variables configuradas:" -ForegroundColor Yellow
Write-Host "  ANDROID_HOME = $env:ANDROID_HOME" -ForegroundColor White
Write-Host "  JAVA_HOME = $env:JAVA_HOME" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Red
Write-Host "1. CIERRA Y REABRE PowerShell para que las variables tomen efecto" -ForegroundColor Yellow
Write-Host "2. Luego ejecuta: .\build-apk.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Enter para salir..."
Read-Host
