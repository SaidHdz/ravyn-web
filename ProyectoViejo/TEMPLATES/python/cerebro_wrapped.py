import json
import re
import os
import glob
from datetime import datetime
from collections import Counter
import emoji

class ChatAnalyzer:
    def __init__(self):
        # Stopwords: Filtro de basura nivel Dios. Agregamos las palabras del sistema de Meta.
        self.palabras_basura = {
            'que', 'de', 'el', 'la', 'y', 'en', 'un', 'a', 'no', 'es', 'te', 'lo', 
            'por', 'con', 'mi', 'una', 'se', 'los', 'me', 'para', 'las', 'si', 'pero', 
            'como', 'ya', 'tu', 'su', 'al', 'o', 'del', 'qué', 'más', 'eso', 'este', 
            'esta', 'muy', 'bien', 'hay', 'message', 'liked', 'reacted', 'to', 
            'attachment', 'call', 'missed', 'audio', 'video', 'sent', 'an'
        }

    # ==========================================
    # 1. LOS EXTRACTORES (PARSERS)
    # ==========================================
    
    def _arreglar_texto_meta(self, texto):
        """ Parche mágico para arreglar el asqueroso encoding de Meta (IG/Messenger) """
        try:
            return texto.encode('latin1').decode('utf8')
        except:
            return texto

    def parse_carpeta_instagram(self, ruta_carpeta, nombre_pareja="Elideth"):
        """ Busca todos los 'message_X.json', los fusiona y arregla los nombres censurados. """
        patron_busqueda = os.path.join(ruta_carpeta, "message_*.json")
        archivos_json = glob.glob(patron_busqueda)
        
        if not archivos_json:
            print(f"⚠️ No se encontraron archivos en: {ruta_carpeta}")
            return []

        mensajes_universales = []
        
        for ruta_archivo in archivos_json:
            print(f"📦 Procesando: {os.path.basename(ruta_archivo)}...")
            with open(ruta_archivo, 'r', encoding='utf-8') as f:
                data = json.load(f)

            for msg in data.get('messages', []):
                if 'content' not in msg:
                    continue 
                    
                sender = self._arreglar_texto_meta(msg.get('sender_name', 'Desconocido'))
                
                # TRUCO MÁGICO: Si Meta ocultó el nombre, le ponemos el real
                if sender == "Usuario de Instagram":
                    sender = nombre_pareja

                content = self._arreglar_texto_meta(msg.get('content', ''))
                timestamp = msg.get('timestamp_ms', 0) / 1000.0
                fecha = datetime.fromtimestamp(timestamp)

                mensajes_universales.append({
                    'remitente': sender,
                    'texto': content,
                    'hora': fecha.hour
                })
                
        print(f"✅ ¡Fusión completa! Se extrajeron {len(mensajes_universales)} mensajes en total.")
        return mensajes_universales


    # ==========================================
    # 2. EL ANALIZADOR MATEMÁTICO
    # ==========================================

    def analizar_mensajes(self, mensajes):
        """ Recibe mensajes universales y saca todas las métricas jugosas """
        total_mensajes = len(mensajes)
        if total_mensajes == 0:
            return None

        conteo_usuarios = Counter()
        conteo_emojis = Counter()
        conteo_palabras = Counter()
        conteo_horas = Counter()

        for msg in mensajes:
            texto = msg['texto']
            
            # FILTRO ANTI-SISTEMA: Ignoramos acciones automáticas de la app
            if texto in ["Liked a message", "Reacted to a message"] or "attachment" in texto:
                continue
                
            texto_lower = texto.lower()
            
            # 1. Contar quién manda más mensajes
            conteo_usuarios[msg['remitente']] += 1
            
            # 2. Mapear horarios (0 a 23 hrs)
            conteo_horas[msg['hora']] += 1
            
            # 3. Extraer emojis
            emojis_en_texto = [c['emoji'] for c in emoji.emoji_list(texto_lower)]
            conteo_emojis.update(emojis_en_texto)
            
            # 4. Extraer palabras (solo letras, mínimo 3 caracteres)
            palabras = re.findall(r'\b[a-záéíóúüñ]{3,}\b', texto_lower)
            palabras_limpias = [p for p in palabras if p not in self.palabras_basura]
            conteo_palabras.update(palabras_limpias)

        # --- Calcular resultados finales ---
        
        # Quién habló más (Evitamos dividir por cero si todo era basura)
        total_reales = sum(conteo_usuarios.values())
        usuarios_ordenados = conteo_usuarios.most_common(2)
        u1_nombre, u1_count = usuarios_ordenados[0]
        u2_nombre, u2_count = usuarios_ordenados[1] if len(usuarios_ordenados) > 1 else ("El Viento", 0)
        
        u1_pct = int((u1_count / total_reales) * 100) if total_reales > 0 else 50
        u2_pct = 100 - u1_pct

        # Horario pico
        hora_pico = conteo_horas.most_common(1)[0][0]
        hora_formato = f"{hora_pico if hora_pico <= 12 else hora_pico-12} {'AM' if hora_pico < 12 else 'PM'}"
        
        # Generar las alturas para la onda CSS (agrupamos en 9 bloques de tiempo)
        bloques_horas = [0]*9
        for h in range(24):
            idx = int((h / 24) * 9)
            bloques_horas[idx] += conteo_horas[h]
        
        # Normalizar a porcentaje (0-100%)
        max_bloque = max(bloques_horas) if max(bloques_horas) > 0 else 1
        alturas_onda = [int((b / max_bloque) * 100) for b in bloques_horas]

        return {
            "total_mensajes": total_mensajes, # Usamos el total original por el impacto visual
            "top_emojis": [e[0] for e in conteo_emojis.most_common(3)],
            "palabra_top": conteo_palabras.most_common(1)[0][0] if conteo_palabras else "nada",
            "usuarios": [u1_nombre, u2_nombre],
            "porcentajes": [u1_pct, u2_pct],
            "hora_pico": hora_formato,
            "alturas_onda": alturas_onda
        }

    # ==========================================
    # 3. EL FORMATEADOR PARA EL FRONTEND
    # ==========================================

    def generar_json_wrapped(self, metricas):
        """ Arma las diapositivas calculadas y añade placeholders para las manuales """
        top_emojis = metricas['top_emojis']
        while len(top_emojis) < 3:
            top_emojis.append("✨")

        diapositivas = [
            {
                "id": "slide_1",
                "tipo": "intro",
                "titulo": "Analizando nuestra conexión...",
                "datos": {
                    "subtitulo": f"Cargando memorias de {metricas['usuarios'][1]} y {metricas['usuarios'][0]}."
                }
            },
            {
                "id": "slide_2",
                "tipo": "metricas_chat",
                "titulo": "Nuestra conexión en números",
                "datos": {
                    "total_mensajes": metricas['total_mensajes'],
                    "palabra_top": metricas['palabra_top'],
                    "top_emojis": top_emojis
                }
            },
            {
                "id": "slide_3",
                "tipo": "grafica_dona",
                "titulo": "El Nivel de Interés",
                "datos": {
                    "subtitulo": "Basado en la cantidad de mensajes enviados",
                    "etiquetas": metricas['usuarios'],
                    "valores": metricas['porcentajes'],
                    "colores": ["#ff66cc", "#4facfe"]
                }
            },
            {
                "id": "slide_4",
                "tipo": "horario_pico",
                "titulo": "¿A qué hora nos amamos más?",
                "datos": {
                    "subtitulo": "El horario pico de nuestros chats",
                    "valores": metricas['alturas_onda'],
                    "pico_hora": metricas['hora_pico']
                }
            },
            # Placeholder para Soundtrack (Manual)
            {
                "id": "slide_5",
                "tipo": "soundtrack",
                "titulo": "Nuestro Soundtrack",
                "datos": {
                    "spotify_embed_url": "https://open.spotify.com/embed/track/3k79jI4A2z6x943E19w2hE?utm_source=generator"
                }
            },
            {
                "id": "slide_6",
                "tipo": "resumen",
                "titulo": "Resumen Wrapped 2026",
                "datos": {
                    "dias_juntos": 365,
                    # Formateamos el número para que diga '18.5k'
                    "total_mensajes": f"{round(metricas['total_mensajes']/1000, 1)}k",
                    "emoji_top": top_emojis[0]
                }
            }
        ]
        
        return diapositivas

# ==========================================
# MOTOR PRINCIPAL
# ==========================================
if __name__ == "__main__":
    cerebro = ChatAnalyzer()
    
    # Usamos la ruta relativa correcta para no romper Windows
    ruta_carpeta_chats = "./ig" 
    
    mensajes_crudos = cerebro.parse_carpeta_instagram(ruta_carpeta_chats, nombre_pareja="Elideth")
    
    if mensajes_crudos:
        metricas = cerebro.analizar_mensajes(mensajes_crudos)
        slides_json = cerebro.generar_json_wrapped(metricas)
        
        print("\n=== PROCESO TERMINADO ===")
        print(f"La palabra real más usada fue: '{metricas['palabra_top']}'")
        
        nombre_archivo_salida = "wrapped_generado.json"
        with open(nombre_archivo_salida, 'w', encoding='utf-8') as f:
            json.dump(slides_json, f, indent=2, ensure_ascii=False)
            
        print(f"✅ ¡JSON guardado exitosamente en la raíz del proyecto como: {nombre_archivo_salida}!")