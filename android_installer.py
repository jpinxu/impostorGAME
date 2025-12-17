"""
Instalador Windows para APK de Android
Descarga ADB automáticamente e instala la APK en dispositivos conectados
"""
import os
import sys
import urllib.request
import zipfile
import subprocess
import shutil
from pathlib import Path

def download_adb():
    """Descarga platform-tools (incluye ADB) si no existe"""
    print("📦 Descargando ADB...")
    
    adb_url = "https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
    zip_path = "platform-tools.zip"
    
    try:
        urllib.request.urlretrieve(adb_url, zip_path)
        print("✓ Descarga completa")
        
        print("📂 Extrayendo archivos...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(".")
        
        os.remove(zip_path)
        print("✓ ADB listo")
        return True
    except Exception as e:
        print(f"❌ Error descargando ADB: {e}")
        return False

def check_device():
    """Verifica si hay dispositivos Android conectados"""
    adb_path = "platform-tools\\adb.exe"
    
    if not os.path.exists(adb_path):
        print("❌ ADB no encontrado")
        return False
    
    try:
        result = subprocess.run([adb_path, "devices"], 
                              capture_output=True, text=True, check=True)
        
        lines = result.stdout.strip().split('\n')
        devices = [line for line in lines[1:] if line.strip() and 'device' in line]
        
        if devices:
            print(f"✓ {len(devices)} dispositivo(s) conectado(s)")
            return True
        else:
            print("⚠ No hay dispositivos conectados")
            print("\nConecta tu dispositivo Android:")
            print("1. Conecta el cable USB")
            print("2. Habilita 'Depuración USB' en Opciones de Desarrollador")
            print("3. Acepta el mensaje de autorización en el dispositivo")
            return False
    except subprocess.CalledProcessError:
        print("❌ Error verificando dispositivos")
        return False

def install_apk(apk_path):
    """Instala la APK en el dispositivo"""
    adb_path = "platform-tools\\adb.exe"
    
    if not os.path.exists(apk_path):
        print(f"❌ APK no encontrada: {apk_path}")
        return False
    
    print(f"📱 Instalando {os.path.basename(apk_path)}...")
    
    try:
        # Desinstalar versión anterior si existe
        subprocess.run([adb_path, "uninstall", "com.impostorgame.app"],
                      capture_output=True, check=False)
        
        # Instalar nueva versión
        result = subprocess.run([adb_path, "install", "-r", apk_path],
                              capture_output=True, text=True, check=True)
        
        if "Success" in result.stdout:
            print("✓ Instalación exitosa!")
            print("\n🎮 Abre 'Impostor Game' en tu dispositivo")
            return True
        else:
            print(f"❌ Error en instalación: {result.stdout}")
            return False
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando APK: {e}")
        return False

def main():
    print("=" * 60)
    print("  IMPOSTOR GAME - Instalador Android")
    print("=" * 60)
    print()
    
    # Buscar APK
    apk_paths = [
        "ImpostorGame.apk",
        "dist-android\\ImpostorGame.apk",
        "mobile-app\\platforms\\android\\app\\build\\outputs\\apk\\debug\\app-debug.apk"
    ]
    
    apk_path = None
    for path in apk_paths:
        if os.path.exists(path):
            apk_path = path
            break
    
    if not apk_path:
        print("❌ APK no encontrada")
        print("\nAsegúrate de tener uno de estos archivos:")
        for path in apk_paths:
            print(f"  - {path}")
        input("\nPresiona Enter para salir...")
        sys.exit(1)
    
    print(f"✓ APK encontrada: {apk_path}")
    print()
    
    # Verificar/descargar ADB
    if not os.path.exists("platform-tools\\adb.exe"):
        response = input("ADB no encontrado. ¿Descargar ahora? (s/n): ")
        if response.lower() == 's':
            if not download_adb():
                input("\nPresiona Enter para salir...")
                sys.exit(1)
        else:
            print("\n⚠ Necesitas ADB para instalar la APK")
            print("Descárgalo de: https://developer.android.com/studio/releases/platform-tools")
            input("\nPresiona Enter para salir...")
            sys.exit(1)
    
    print()
    
    # Verificar dispositivo
    if not check_device():
        input("\nPresiona Enter para salir...")
        sys.exit(1)
    
    print()
    
    # Instalar APK
    if install_apk(apk_path):
        print("\n" + "=" * 60)
        print("  ✓ INSTALACIÓN COMPLETA")
        print("=" * 60)
    else:
        print("\n❌ Instalación fallida")
    
    input("\nPresiona Enter para salir...")

if __name__ == "__main__":
    main()
