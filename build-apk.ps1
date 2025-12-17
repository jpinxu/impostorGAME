# Script para construir APK de Android desde la app web
# Requiere: Node.js, Cordova, Java JDK, Android SDK

Write-Host "=== Impostor Game - Build APK Android ===" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

# 1. Verificar prerrequisitos
Write-Host "Verificando prerrequisitos..." -ForegroundColor Yellow

# Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js no encontrado. Instala desde: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Java
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "[OK] Java JDK instalado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java JDK no encontrado." -ForegroundColor Red
    exit 1
}

# Cordova
try {
    $cordovaVersion = cordova --version
    Write-Host "[OK] Cordova: $cordovaVersion" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Cordova no encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g cordova
}

Write-Host ""
Write-Host "2. Preparando archivos..." -ForegroundColor Cyan

# Limpiar y copiar archivos web
if (Test-Path "mobile-app\www") {
    Remove-Item "mobile-app\www\*" -Recurse -Force -ErrorAction SilentlyContinue
}

Copy-Item "static\*" "mobile-app\www\" -Recurse -Force
Copy-Item "templates\index.html" "mobile-app\www\index.html" -Force

# Modificar HTML para usar rutas relativas
$htmlContent = Get-Content "mobile-app\www\index.html" -Raw
$htmlContent = $htmlContent -replace "{{ url_for\('static', filename='style.css'\) }}", "style.css"
$htmlContent = $htmlContent -replace "{{ url_for\('static', filename='script.js'\) }}", "script.js"
$htmlContent = $htmlContent -replace "</head>", "<meta name=`"viewport`" content=`"width=device-width, initial-scale=1.0, user-scalable=no`">`n<script type=`"text/javascript`" src=`"cordova.js`"></script>`n</head>"
Set-Content "mobile-app\www\index.html" $htmlContent

Write-Host "[OK] Archivos copiados y adaptados" -ForegroundColor Green

# 3. Actualizar config.xml
Write-Host ""
Write-Host "3. Configurando proyecto..." -ForegroundColor Cyan

$configXml = @"
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.impostorgame.app" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Impostor Game</name>
    <description>Juego de rol social - Encuentra al impostor</description>
    <author email="dev@impostorgame.com" href="https://github.com/jpinxu/impostorGAME">
        Impostor Game Team
    </author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <platform name="android">
        <preference name="android-minSdkVersion" value="24" />
        <preference name="android-targetSdkVersion" value="35" />
        <preference name="Orientation" value="portrait" />
    </platform>
    <preference name="DisallowOverscroll" value="true" />
    <preference name="BackgroundColor" value="0xff1a1a2e" />
</widget>
"@

Set-Content "mobile-app\config.xml" $configXml
Write-Host "[OK] config.xml actualizado" -ForegroundColor Green

# 4. Construir APK
Write-Host ""
Write-Host "4. Construyendo APK..." -ForegroundColor Cyan
Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Yellow
Write-Host ""

cd mobile-app

# Limpiar build anterior
if (Test-Path "platforms\android\app\build\outputs") {
    Remove-Item "platforms\android\app\build\outputs" -Recurse -Force -ErrorAction SilentlyContinue
}

# Build debug APK (no requiere firma)
cordova build android --verbose

cd ..

# 5. Verificar resultado
Write-Host ""
if (Test-Path "mobile-app\platforms\android\app\build\outputs\apk\debug\app-debug.apk") {
    Write-Host "=== BUILD EXITOSO ===" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = Resolve-Path "mobile-app\platforms\android\app\build\outputs\apk\debug\app-debug.apk"
    $apkSize = (Get-Item $apkPath).Length / 1MB
    
    # Copiar APK a carpeta dist
    if (-not (Test-Path "dist-android")) {
        New-Item -ItemType Directory -Path "dist-android" | Out-Null
    }
    
    Copy-Item $apkPath "dist-android\ImpostorGame.apk" -Force
    
    Write-Host "APK creado en: dist-android\ImpostorGame.apk" -ForegroundColor Cyan
    Write-Host "Tamaño: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "INSTALACION:" -ForegroundColor Yellow
    Write-Host "1. Transfiere ImpostorGame.apk a tu dispositivo Android" -ForegroundColor White
    Write-Host "2. Habilita 'Instalar apps desconocidas' en configuracion" -ForegroundColor White
    Write-Host "3. Abre el archivo APK y instala" -ForegroundColor White
    Write-Host ""
    Write-Host "O usa ADB: adb install dist-android\ImpostorGame.apk" -ForegroundColor White
} else {
    Write-Host "=== BUILD FALLIDO ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "1. Instala Android SDK o Android Studio" -ForegroundColor White
    Write-Host "2. Configura ANDROID_HOME en variables de entorno" -ForegroundColor White
    Write-Host "3. Ejecuta: cordova requirements android" -ForegroundColor White
    exit 1
}
