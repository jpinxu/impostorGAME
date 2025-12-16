# Impostor Game

## Instalación Local

```powershell
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar aplicación
python app.py
```

Abrir en navegador: `http://localhost:5000`

## Desplegar en Render.com (GRATIS)

1. Sube el código a GitHub (crea un repositorio)
2. Ve a [render.com](https://render.com) y crea cuenta
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configuración:
   - **Name:** impostor-game (o el que quieras)
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
6. Click "Create Web Service"

En 2-3 minutos tendrás una URL pública tipo: `https://impostor-game.onrender.com`

**Nota:** El plan gratuito "duerme" la app después de 15 minutos sin uso. La primera carga después de dormir toma ~30 segundos.
