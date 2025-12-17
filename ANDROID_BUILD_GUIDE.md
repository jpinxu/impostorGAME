# Guía: Crear APK de Impostor Game

## 📱 Opción 1: Build Automático (Requiere Android SDK)

### Prerrequisitos

1. **Java JDK** ✓ (Ya instalado)
2. **Node.js** ✓ (Ya instalado)
3. **Android SDK** ❌ (Falta instalar)

### Instalar Android SDK

**Opción A: Android Studio (Recomendado)**
1. Descarga: https://developer.android.com/studio
2. Instala Android Studio
3. Abre SDK Manager y descarga:
   - Android SDK Platform 35
   - Android SDK Build-Tools
   - Android SDK Command-line Tools

4. Configura variables de entorno:
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk", "User")
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-25", "User")
```

5. Reinicia PowerShell y ejecuta:
```powershell
.\build-apk.ps1
```

---

**Opción B: Command Line Tools Standalone**
1. Descarga: https://developer.android.com/studio#command-line-tools-only
2. Extrae en `C:\Android\cmdline-tools`
3. Ejecuta:
```powershell
cd C:\Android\cmdline-tools\bin
.\sdkmanager.bat "platform-tools" "platforms;android-35" "build-tools;35.0.0"
```

4. Configura ANDROID_HOME:
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Android", "User")
```

---

## 📱 Opción 2: APK Builder Online (SIN instalaciones)

**Más fácil y rápido - Recomendado si no tienes Android SDK**

### Servicios Web para Convertir Web App a APK:

1. **PWABuilder** (Microsoft) - https://www.pwabuilder.com/
   - Sube tu app web
   - Genera APK automáticamente
   - GRATIS

2. **Apache Cordova Build** (PhoneGap)
   - Requiere cuenta Adobe (gratis)
   - Build en la nube

3. **Capacitor** + **Ionic AppFlow**
   - Alternativa moderna a Cordova

### Pasos con PWABuilder:

1. Primero ejecuta tu app localmente:
```powershell
python app.py
```

2. Ve a http://localhost:5000

3. Abre https://www.pwabuilder.com/

4. Ingresa URL: `http://localhost:5000` (o despliega primero en web)

5. Click "Start" → "Download Package" (Android)

6. Obtienes APK lista para instalar

---

## 📱 Opción 3: Instalación Manual (APK Pre-construida)

Si construyes la APK, compártela:

### Para el Usuario Final:

1. Descarga `ImpostorGame.apk`
2. En Android:
   - Ve a Configuración → Seguridad
   - Habilita "Instalar apps desconocidas"
3. Abre el archivo APK
4. Click "Instalar"

### Con ADB (Desde PC):

1. Habilita "Depuración USB" en el dispositivo
2. Conecta USB
3. Ejecuta:
```powershell
# Descargar ADB
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/platform-tools-latest-windows.zip" -OutFile "adb.zip"
Expand-Archive "adb.zip" -DestinationPath "."

# Instalar APK
.\platform-tools\adb.exe install ImpostorGame.apk
```

---

## 🎯 Recomendación

**Para desarrollo rápido:** Usa PWABuilder (Opción 2)
- No requiere instalaciones
- APK lista en minutos
- Gratis y sin configuraciones

**Para control total:** Instala Android SDK (Opción 1)
- Build local
- Personalización completa
- Firmar APK para Play Store

---

## 📦 Estructura del Proyecto Android

```
mobile-app/
├── www/                    # App web
│   ├── index.html         # UI
│   ├── script.js          # Lógica
│   └── style.css          # Estilos
├── platforms/android/      # Proyecto Android generado
└── config.xml             # Configuración Cordova
```

---

## ❓ Problemas Comunes

**"ANDROID_HOME not found"**
- Instala Android SDK
- Configura variable de entorno

**"Java not found"**
- Ya tienes Java 25 instalado ✓
- Asegúrate que JAVA_HOME apunte a la carpeta correcta

**"Build failed"**
- Ejecuta: `cordova clean android`
- Vuelve a intentar

---

## 🚀 Alternativa: PWA (Sin APK)

Tu app ya funciona como **Progressive Web App**:

1. Abre en Chrome Android: https://tu-app-en-render.com
2. Click menú (⋮) → "Agregar a pantalla de inicio"
3. Se instala como app nativa

**Ventajas:**
- Sin APK
- Actualizaciones automáticas
- Multiplataforma (iOS + Android)

---

## 📝 Resumen

| Método | Dificultad | Tiempo | Requiere |
|--------|-----------|--------|----------|
| PWABuilder | ⭐ Fácil | 5 min | Navegador |
| Android SDK | ⭐⭐⭐ Difícil | 1-2 hrs | 3 GB descarga |
| ADB Manual | ⭐⭐ Media | 10 min | APK lista |
| PWA | ⭐ Muy fácil | 2 min | Nada |

**Recomendación:** Comienza con PWABuilder o PWA.
