import subprocess
import requests
import psutil
import os

# ----- CONFIGURACIÓN -----
BOT_TOKEN = "8415634634:AAH_zYr_4OUl9z3khlo_xogDPv_n_aKxt2M"
CHAT_ID = "-1003249465224"
BOT_PATH = r"C:\Users\istan\Desktop\DanielWatcher\notificador.py"
PYTHON_PATH = r"C:\Users\istan\AppData\Local\Python\bin\pythonw.exe"  # pythonw para no mostrar ventana
PID_FILE = r"C:\Users\istan\Desktop\DanielWatcher\reparo_lock.pid"  # lock file

# ----- FUNCIÓN TELEGRAM -----
def enviar_mensaje(texto):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = {"chat_id": CHAT_ID, "text": texto}
    try:
        requests.post(url, data=data)
    except:
        pass  # evita que se caiga si no hay red

# ----- LOCK SIMPLE -----
if os.path.exists(PID_FILE):
    exit()  # Ya hay otra instancia corriendo
with open(PID_FILE, "w") as f:
    f.write(str(os.getpid()))

try:
    # ----- VERIFICA SI EL BOT ESTÁ ACTIVO -----
    bot_activo = False
    for proceso in psutil.process_iter(['name', 'cmdline']):
        cmdline = proceso.info.get('cmdline')
        if cmdline and 'python' in (proceso.info.get('name') or '').lower() and 'notificador.py' in ' '.join(cmdline):
            bot_activo = True
            break

    # ----- SI NO ESTÁ, REINICIA -----
    if not bot_activo:
        enviar_mensaje("🚫 El bot se detuvo. Reiniciando...")
        subprocess.Popen([PYTHON_PATH, BOT_PATH])
        enviar_mensaje("✅ Bot reiniciado correctamente.")

finally:
    # ----- BORRA LOCK -----
    if os.path.exists(PID_FILE):
        os.remove(PID_FILE)
