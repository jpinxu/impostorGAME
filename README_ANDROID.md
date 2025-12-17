# 📱 Impostor Game - APK para Android

## ✅ Lo que YA está listo:

- ✅ Proyecto Cordova creado en `mobile-app/`
- ✅ Archivos web adaptados para móvil
- ✅ Scripts de build automatizados
- ✅ Instalador Windows para APK

## 🚀 Opciones para Obtener la APK:

### **Opción 1: Build Online (MÁS FÁCIL - 5 minutos)** ⭐ RECOMENDADO

No requiere instalaciones. Usa servicios web gratuitos:

#### A) PWABuilder (Microsoft):
1. Despliega tu app en web (ya está en Render)
2. Ve a: https://www.pwabuilder.com/
3. Ingresa tu URL: `https://impostor-game.onrender.com`
4. Click "Build" → Selecciona "Android"
5. Descarga APK (~5 MB)

#### B) AppsGeyser (Sin código):
1. Ve a: https://appsgeyser.com/
2. "Create App" → "Website"
3. URL: tu app desplegada
4. Descarga APK

---

### **Opción 2: Build Local (Requiere Android SDK)** 

**Prerrequisitos:**
- ✅ Java JDK 25 (instalado)
- ✅ Node.js + Cordova (instalado)
- ❌ Android SDK (~3 GB) - **FALTA INSTALAR**

**Instalar Android SDK:**

1. Descarga Android Studio: https://developer.android.com/studio
2. Abre SDK Manager → Instala:
   - Android SDK Platform 35
   - Android SDK Build-Tools 35.0.0
   - Android SDK Command-line Tools

3. Configura variables de entorno en PowerShell (Admin):
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")
$path = [System.Environment]::GetEnvironmentVariable("Path", "User")
[System.Environment]::SetEnvironmentVariable("Path", "$path;C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools", "User")
```

4. Reinicia PowerShell y ejecuta:
```powershell
.\build-apk.ps1
```

**Resultado:** `dist-android\ImpostorGame.apk` (~5-8 MB)

---

### **Opción 3: PWA (Sin APK necesaria)** ⚡ LA MÁS SIMPLE

Tu app ya es una PWA. No necesitas APK:

1. Abre en Chrome Android: https://tu-app.onrender.com
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. ¡Listo! Se comporta como app nativa

**Ventajas:**
- Sin instalación
- Actualizaciones automáticas
- Funciona en iOS y Android

---

## 📦 Instalador Windows para APK

Una vez tengas la APK, puedes crear un instalador EXE:

### Opción A: Instalador con la APK incluida
```powershell
# 1. Copia tu APK a dist-android/ImpostorGame.apk
# 2. Ejecuta:
.\build-android-installer.ps1
```

Genera: `dist\ImpostorGameAndroidInstaller.exe` (~8-10 MB)

**Funcionalidad:**
- Incluye la APK dentro del EXE
- Descarga ADB automáticamente
- Instala en dispositivo conectado

### Opción B: Instalador que descarga APK
```powershell
# Si la APK está en GitHub Releases
python android_installer.py
```

---

## 🎯 Mi Recomendación

**Para compartir con amigos:**
1. Usa **PWABuilder** (Opción 1A) - 5 minutos, sin instalaciones
2. Obtienes APK de ~5 MB
3. Sube a Google Drive o Discord
4. Comparte enlace de descarga

**Para desarrollo profesional:**
- Instala Android SDK
- Firma la APK
- Sube a Google Play Store

---

## 📱 Instalación en Android

### Usuario final:
1. Descarga `ImpostorGame.apk`
2. En Android: Configuración → Seguridad → Habilitar "Orígenes desconocidos"
3. Abre el archivo APK
4. Click "Instalar"

### Con ADB (desde PC):
```powershell
# Descargar ADB
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/platform-tools-latest-windows.zip" -OutFile "adb.zip"
Expand-Archive "adb.zip"

# Instalar en dispositivo conectado
.\adb\platform-tools\adb.exe install ImpostorGame.apk
```

---

## 🛠️ Archivos del Proyecto

```
📁 mobile-app/              # Proyecto Cordova
│  ├── www/                 # App web (HTML/CSS/JS)
│  ├── platforms/android/   # Código Android generado
│  └── config.xml           # Configuración

📄 build-apk.ps1            # Script automatizado de build
📄 android_installer.py     # Instalador Python
📄 build-android-installer.ps1  # Compilar instalador a EXE
```

---

## ❓ FAQ

**¿Por qué no está la APK incluida?**
- Requiere Android SDK (~3 GB) que no está instalado
- Más fácil usar servicios online (PWABuilder)

**¿Cuánto pesa la APK?**
- ~5-8 MB (depende del método de build)

**¿Funciona offline?**
- Sí, una vez instalada

**¿Se puede subir a Play Store?**
- Sí, pero necesitas firmarla con tu keystore

---

## 🚀 Próximos Pasos

1. **Opción rápida:** Ve a PWABuilder y genera la APK en 5 min
2. **Opción Pro:** Instala Android SDK y ejecuta `.\build-apk.ps1`
3. **Sin APK:** Usa como PWA directamente

¿Necesitas ayuda? Abre un issue en GitHub.
