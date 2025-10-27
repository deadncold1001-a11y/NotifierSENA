import requests
from bs4 import BeautifulSoup
import time

TOKEN = "8415634634:AAH_zYr_4OUl9z3khlo_xogDPv_n_aKxt2M"
CHAT_ID = "-1003249465224"
URL = "https://zajuna.sena.edu.co/zajuna/mod/forum/view.php?id=5024822"

def enviar_mensaje(mensaje):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    data = {"chat_id": CHAT_ID, "text": mensaje}
    try:
        requests.post(url, data=data)
    except:
        pass

enviar_mensaje("⏰ Bot iniciado correctamente y ejecutándose en segundo plano.")

ultimo_titulo = ""

while True:
    try:
        response = requests.get(URL, verify=False)  # verify=False porque el sitio tiene SSL no verificado
        soup = BeautifulSoup(response.text, "html.parser")
        primer_post = soup.find("tr", class_="discussion")
        if primer_post:
            titulo = primer_post.text.strip()
            if titulo != ultimo_titulo and titulo != "":
                enviar_mensaje(f"🆕 Nueva publicación en Zajuna:\n{titulo}")
                ultimo_titulo = titulo
    except:
        pass  # Ignora errores silenciosamente

    time.sleep(1800)  # Revisa cada 30 minutos
