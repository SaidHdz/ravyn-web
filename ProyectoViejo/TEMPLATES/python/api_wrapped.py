# api_wrapped.py
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import tempfile
import os
import json
from cerebro_wrapped import ChatAnalyzer  # Importamos la clase que ya armaste

app = FastAPI()
cerebro = ChatAnalyzer()

# Estructura de los datos que n8n nos va a mandar
class WrappedRequest(BaseModel):
    urls_archivos: list[str]
    nombre_pareja: str

@app.post("/generar_wrapped")
async def generar_wrapped(req: WrappedRequest):
    # Creamos una carpeta temporal para descargar los JSONs de Tally
    with tempfile.TemporaryDirectory() as temp_dir:
        
        # 1. Descargar los archivos desde las URLs de Tally
        for i, url in enumerate(req.urls_archivos):
            if not url or url.strip() == "": 
                continue # Si n8n manda una URL vacía, la ignoramos
                
            try:
                # Simulamos ser un navegador para que Tally no nos bloquee
                headers = {'User-Agent': 'Mozilla/5.0'}
                response = requests.get(url, headers=headers)
                
                if response.status_code == 200: # <--- ¡AQUÍ ESTABA EL TYPO!
                    ruta_temp = os.path.join(temp_dir, f"message_{i}.json")
                    with open(ruta_temp, 'wb') as f:
                        f.write(response.content)
                        print(f"✅ Archivo {i} descargado con éxito!")
                else:
                    print(f"❌ Error HTTP {response.status_code} al descargar: {url}")
            except Exception as e:
                print(f"⚠️ Error descargando {url}: {e}")

        # 2. Ejecutar tu analizador sobre la carpeta temporal
        mensajes_crudos = cerebro.parse_carpeta_instagram(temp_dir, req.nombre_pareja)
        
        if not mensajes_crudos:
            return {"error": "No se pudieron procesar los mensajes"}

        # 3. Sacar métricas y diapositivas
        metricas = cerebro.analizar_mensajes(mensajes_crudos)
        diapositivas_generadas = cerebro.generar_json_wrapped(metricas)

        return {"diapositivas": diapositivas_generadas}

# Para correrlo en tu consola usa: uvicorn api_wrapped:app --reload