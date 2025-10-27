import psutil
import requests

BOT_TOKEN = "8415634634:AAH_zYr_4OUl9z3khlo_xogDPv_n_aKxt2M"
CHAT_ID = "-1003249465224"

def enviar_mensaje(texto):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = {"chat_id": CHAT_ID, "text": texto}
    try:
        requests.post(url, data=data)
    except:
        pass

bot_activo = False
for proceso in psutil.process_iter(['name', 'cmdline']):
    cmdline = proceso.info.get('cmdline') or []
    if 'python' in (proceso.info.get('name') or '').lower() and 'notificador.py' in ' '.join(cmdline):
        bot_activo = True
        break

if bot_activo:
    enviar_mensaje("🟢 El bot está corriendo normalmente.")
else:
    enviar_mensaje("🔴 El bot NO está corriendo.")
