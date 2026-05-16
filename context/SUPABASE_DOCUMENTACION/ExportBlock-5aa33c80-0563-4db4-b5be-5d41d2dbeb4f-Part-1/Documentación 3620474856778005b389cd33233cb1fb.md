# Documentación

```markdown
Ravyn CRM — Base de Datos

Infraestructura

- Motor: PostgreSQL 15.8 (imagen supabase/postgres:15.8.1.020)
- Host Docker: ravyn_db
- DB: postgres
- API URL: [https://ravyn-api.srv1574981.hstgr.cloud](https://ravyn-api.srv1574981.hstgr.cloud/)
- Studio URL: [https://ravyn-studio.srv1574981.hstgr.cloud](https://ravyn-studio.srv1574981.hstgr.cloud/)

Configuración del servidor Postgres

┌─────────────────────────────────────┬─────────┬──────────────────────────────────────────────────────────────────┐
│              Parámetro              │  Valor  │                            Propósito                             │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ max_connections                     │ 200     │ Máximo de conexiones directas a Postgres                         │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ shared_buffers                      │ 256MB   │ Memoria caché compartida                                         │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ idle_in_transaction_session_timeout │ 60000ms │ Mata conexiones que se quedan colgadas en una transacción        │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ superuser_reserved_connections      │ 5       │ Reserva conexiones para administración aunque el pool esté lleno │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ tcp_keepalives_idle                 │ 60s     │ Tiempo antes de enviar keepalive a conexión inactiva             │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ tcp_keepalives_interval             │ 10s     │ Intervalo entre keepalives                                       │
├─────────────────────────────────────┼─────────┼──────────────────────────────────────────────────────────────────┤
│ tcp_keepalives_count                │ 5       │ Intentos antes de cerrar conexión muerta                         │
└─────────────────────────────────────┴─────────┴──────────────────────────────────────────────────────────────────┘

PgBouncer (Connection Pooler)

┌──────────────────────┬─────────────┐
│      Parámetro       │    Valor    │
├──────────────────────┼─────────────┤
│ pool_mode            │ transaction │
├──────────────────────┼─────────────┤
│ max_client_conn      │ 1000        │
├──────────────────────┼─────────────┤
│ default_pool_size    │ 15          │
├──────────────────────┼─────────────┤
│ min_pool_size        │ 3           │
├──────────────────────┼─────────────┤
│ reserve_pool_size    │ 5           │
├──────────────────────┼─────────────┤
│ reserve_pool_timeout │ 3s          │
├──────────────────────┼─────────────┤
│ server_idle_timeout  │ 60s         │
├──────────────────────┼─────────────┤
│ client_idle_timeout  │ 300s        │
├──────────────────────┼─────────────┤
│ server_lifetime      │ 3600s       │
└──────────────────────┴─────────────┘

Todos los servicios (Auth, REST, Storage, Meta) conectan a Postgres a través de PgBouncer, nunca directo.

---

Extensiones instaladas

┌───────────┬─────────┬───────────────────────────────────────────┐
│ Extensión │ Versión │                    Uso                    │
├───────────┼─────────┼───────────────────────────────────────────┤
│ plpgsql   │ 1.0     │ Lenguaje para funciones/triggers          │
├───────────┼─────────┼───────────────────────────────────────────┤
│ uuid-ossp │ 1.1     │ Generación de UUIDs (uuid_generate_v4())  │
├───────────┼─────────┼───────────────────────────────────────────┤
│ pgcrypto  │ 1.3     │ Funciones criptográficas                  │
├───────────┼─────────┼───────────────────────────────────────────┤
│ pgjwt     │ 0.2.0   │ Lectura de JWT dentro de SQL (auth.jwt()) │
└───────────┴─────────┴───────────────────────────────────────────┘

---

Schemas

┌───────────┬───────────────────────────────────────────────────────────────┐
│  Schema   │                           Propósito                           │
├───────────┼───────────────────────────────────────────────────────────────┤
│ public    │ Datos de la aplicación (clínicas, usuarios, pacientes, citas) │
├───────────┼───────────────────────────────────────────────────────────────┤
│ auth      │ Manejado por GoTrue — credenciales, sesiones, tokens          │
├───────────┼───────────────────────────────────────────────────────────────┤
│ storage   │ Manejado por Supabase Storage — archivos                      │
├───────────┼───────────────────────────────────────────────────────────────┤
│ _realtime │ Manejado por Supabase Realtime — suscripciones                │
└───────────┴───────────────────────────────────────────────────────────────┘

---

Tablas

public.clinics

Cada clínica es un tenant independiente. Se crea automáticamente cuando un admin se registra.

┌────────────┬─────────────┬──────────┬────────────────────┬───────────────────────────────────────┐
│  Columna   │    Tipo     │ Nullable │      Default       │                 Notas                 │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ id         │ uuid        │ NO       │ uuid_generate_v4() │ PK                                    │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ name       │ text        │ NO       │ —                  │ Nombre de la clínica                  │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ phone      │ text        │ SÍ       │ —                  │                                       │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ email      │ text        │ SÍ       │ —                  │                                       │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ subdomain  │ text        │ SÍ       │ —                  │ Único, para URL {subdomain}.tuapp.com │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ plan       │ text        │ SÍ       │ 'basic'            │ Plan de suscripción                   │
├────────────┼─────────────┼──────────┼────────────────────┼───────────────────────────────────────┤
│ created_at │ timestamptz │ SÍ       │ now()              │                                       │
└────────────┴─────────────┴──────────┴────────────────────┴───────────────────────────────────────┘

Índices:

- clinics_pkey — PRIMARY KEY en id
- clinics_subdomain_key — UNIQUE en subdomain

RLS: habilitado — política clinic_isolation

---

public.users

Perfil de usuario de la app. El id es el mismo UUID que [auth.users.id](http://auth.users.id/) — nunca almacena contraseñas.

┌────────────┬─────────────┬──────────┬─────────┬────────────────────────────────┐
│  Columna   │    Tipo     │ Nullable │ Default │             Notas              │
├────────────┼─────────────┼──────────┼─────────┼────────────────────────────────┤
│ id         │ uuid        │ NO       │ —       │ PK, FK → [auth.users.id](http://auth.users.id/)         │
├────────────┼─────────────┼──────────┼─────────┼────────────────────────────────┤
│ clinic_id  │ uuid        │ SÍ       │ —       │ FK → [clinics.id](http://clinics.id/) CASCADE DELETE │
├────────────┼─────────────┼──────────┼─────────┼────────────────────────────────┤
│ full_name  │ text        │ SÍ       │ —       │                                │
├────────────┼─────────────┼──────────┼─────────┼────────────────────────────────┤
│ role       │ text        │ SÍ       │ 'staff' │ Solo 'admin' o 'staff'         │
├────────────┼─────────────┼──────────┼─────────┼────────────────────────────────┤
│ created_at │ timestamptz │ SÍ       │ now()   │                                │
└────────────┴─────────────┴──────────┴─────────┴────────────────────────────────┘

Constraints:

- users_role_check — role IN ('admin', 'staff')

RLS: habilitado — política clinic_isolation

---

public.patients

Pacientes de una clínica. Un paciente pertenece exclusivamente a la clínica que lo registró.

┌────────────┬─────────────┬──────────┬────────────────────┬────────────────────────────────┐
│  Columna   │    Tipo     │ Nullable │      Default       │             Notas              │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ id         │ uuid        │ NO       │ uuid_generate_v4() │ PK                             │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ clinic_id  │ uuid        │ SÍ       │ —                  │ FK → [clinics.id](http://clinics.id/) CASCADE DELETE │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ full_name  │ text        │ NO       │ —                  │                                │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ phone      │ text        │ SÍ       │ —                  │                                │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ email      │ text        │ SÍ       │ —                  │                                │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ notes      │ text        │ SÍ       │ —                  │                                │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ source     │ text        │ SÍ       │ 'manual'           │ 'whatsapp', 'web' o 'manual'   │
├────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────┤
│ created_at │ timestamptz │ SÍ       │ now()              │                                │
└────────────┴─────────────┴──────────┴────────────────────┴────────────────────────────────┘

Constraints:

- patients_source_check — source IN ('whatsapp', 'web', 'manual')

RLS: habilitado — política clinic_isolation

---

public.appointments

Citas agendadas. Referencia a la clínica y al paciente.

┌──────────────────┬─────────────┬──────────┬────────────────────┬────────────────────────────────────────────┐
│     Columna      │    Tipo     │ Nullable │      Default       │                   Notas                    │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ id               │ uuid        │ NO       │ uuid_generate_v4() │ PK                                         │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ clinic_id        │ uuid        │ SÍ       │ —                  │ FK → [clinics.id](http://clinics.id/) CASCADE DELETE             │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ patient_id       │ uuid        │ SÍ       │ —                  │ FK → [patients.id](http://patients.id/) SET NULL si se borra      │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ scheduled_at     │ timestamptz │ NO       │ —                  │ Fecha y hora de la cita                    │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ duration_minutes │ integer     │ SÍ       │ 30                 │ Duración en minutos                        │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ status           │ text        │ SÍ       │ 'pending'          │ Ver valores válidos abajo                  │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ service          │ text        │ SÍ       │ —                  │ Tipo de servicio/consulta                  │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ notes            │ text        │ SÍ       │ —                  │                                            │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ source           │ text        │ SÍ       │ 'manual'           │ 'whatsapp', 'web' o 'manual'               │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ n8n_execution_id │ text        │ SÍ       │ —                  │ ID de ejecución en n8n (para trazabilidad) │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ created_at       │ timestamptz │ SÍ       │ now()              │                                            │
├──────────────────┼─────────────┼──────────┼────────────────────┼────────────────────────────────────────────┤
│ updated_at       │ timestamptz │ SÍ       │ now()              │ Actualizado automáticamente por trigger    │
└──────────────────┴─────────────┴──────────┴────────────────────┴────────────────────────────────────────────┘

Constraints:

- appointments_status_check — status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')
- appointments_source_check — source IN ('whatsapp', 'web', 'manual')

Trigger: set_updated_at — actualiza updated_at automáticamente en cada UPDATE

RLS: habilitado — política clinic_isolation

---

public.appointment_logs

Historial de cambios de estado en citas. Append-only, nunca se modifica.

┌────────────────┬─────────────┬──────────┬────────────────────┬─────────────────────────────────────┐
│    Columna     │    Tipo     │ Nullable │      Default       │                Notas                │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ id             │ uuid        │ NO       │ uuid_generate_v4() │ PK                                  │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ appointment_id │ uuid        │ SÍ       │ —                  │ FK → [appointments.id](http://appointments.id/) CASCADE DELETE │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ changed_by     │ uuid        │ SÍ       │ —                  │ FK → [users.id](http://users.id/) SET NULL si se borra  │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ old_status     │ text        │ SÍ       │ —                  │ Estado anterior                     │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ new_status     │ text        │ SÍ       │ —                  │ Estado nuevo                        │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ note           │ text        │ SÍ       │ —                  │ Comentario opcional                 │
├────────────────┼─────────────┼──────────┼────────────────────┼─────────────────────────────────────┤
│ created_at     │ timestamptz │ SÍ       │ now()              │                                     │
└────────────────┴─────────────┴──────────┴────────────────────┴─────────────────────────────────────┘

RLS: habilitado — política clinic_isolation (via JOIN con appointments)

---

Funciones

generate_subdomain(clinic_name text) → text

Genera un subdomain URL-safe a partir del nombre de la clínica.

Lógica:

1. Lowercase + trim del nombre
2. Reemplaza caracteres acentuados (á→a, é→e, í→i, ó→o, ú→u, ñ→n, ç→c, etc.)
3. Reemplaza cualquier carácter no alfanumérico por -
4. Elimina guiones al inicio/fin
5. Verifica unicidad en clinics.subdomain; si existe, agrega sufijo -2, -3, etc.

Ejemplos:

┌────────────────────────────┬───────────────────────┐
│           Input            │        Output         │
├────────────────────────────┼───────────────────────┤
│ Clínica García             │ clinica-garcia        │
├────────────────────────────┼───────────────────────┤
│ Dental & Estética López    │ dental-estetica-lopez │
├────────────────────────────┼───────────────────────┤
│ Centro Médico Ñoño         │ centro-medico-nono    │
├────────────────────────────┼───────────────────────┤
│ Clínica García (duplicada) │ clinica-garcia-2      │
└────────────────────────────┴───────────────────────┘

---

handle_new_user() → trigger

Se ejecuta en AFTER INSERT ON auth.users. Conecta el sistema de autenticación con los datos de la app.

Flujo para role = 'admin' (registro nuevo):

1. Toma clinic_subdomain del metadata; si no viene, llama a generate_subdomain(clinic_name)
2. Crea un registro en public.clinics
3. Crea un registro en public.users con role = 'admin'

Flujo para role = 'staff' (admin crea un empleado):

1. Toma clinic_id del metadata
2. Crea un registro en public.users con role = 'staff'

Metadata esperado al llamar supabase.auth.signUp():

// Admin (registro de clínica nueva)
{
full_name: 'Dra. García',
clinic_name: 'Clínica García',
clinic_phone: '555-0000',
clinic_email: 'contacto@clinica.com'
// clinic_subdomain es opcional — se genera automáticamente
}

// Staff (creado por un admin vía Admin API)
{
full_name: 'Juan López',
role: 'staff',
clinic_id: '<uuid-de-la-clinica>'
}

---

update_updated_at() → trigger

Función simple que asigna NEW.updated_at = now(). Usada por el trigger set_updated_at en appointments.

---

Triggers

┌──────────────────────┬─────────────────────┬────────┬─────────┬─────────────────────┐
│       Trigger        │        Tabla        │ Evento │ Momento │       Función       │
├──────────────────────┼─────────────────────┼────────┼─────────┼─────────────────────┤
│ on_auth_user_created │ auth.users          │ INSERT │ AFTER   │ handle_new_user()   │
├──────────────────────┼─────────────────────┼────────┼─────────┼─────────────────────┤
│ set_updated_at       │ public.appointments │ UPDATE │ BEFORE  │ update_updated_at() │
└──────────────────────┴─────────────────────┴────────┴─────────┴─────────────────────┘

---

Row Level Security (RLS)

Todas las tablas de la app tienen RLS habilitado. La política clinic_isolation en todas ellas garantiza que cada clínica solo
puede ver y modificar sus propios datos, usando el clinic_id embebido en el JWT del usuario autenticado (auth.jwt() ->>
'clinic_id').

┌──────────────────┬──────────────────┬───────────────────────────────────────────────────────┐
│      Tabla       │     Política     │                       Condición                       │
├──────────────────┼──────────────────┼───────────────────────────────────────────────────────┤
│ clinics          │ clinic_isolation │ id = jwt.clinic_id                                    │
├──────────────────┼──────────────────┼───────────────────────────────────────────────────────┤
│ users            │ clinic_isolation │ clinic_id = jwt.clinic_id                             │
├──────────────────┼──────────────────┼───────────────────────────────────────────────────────┤
│ patients         │ clinic_isolation │ clinic_id = jwt.clinic_id                             │
├──────────────────┼──────────────────┼───────────────────────────────────────────────────────┤
│ appointments     │ clinic_isolation │ clinic_id = jwt.clinic_id                             │
├──────────────────┼──────────────────┼───────────────────────────────────────────────────────┤
│ appointment_logs │ clinic_isolation │ JOIN con appointments donde clinic_id = jwt.clinic_id │
└──────────────────┴──────────────────┴───────────────────────────────────────────────────────┘

▎ Nota: el campo clinic_id debe incluirse en el JWT como custom claim. Esto se configura en Supabase Auth mediante una función
▎ auth.jwt() hook o añadiendo el claim en el token al momento del login.

---

Relaciones (ERD simplificado)

clinics (1) ──────< users (N)
clinics (1) ──────< patients (N)
clinics (1) ──────< appointments (N)
patients (1) ─────< appointments (N)
appointments (1) ──< appointment_logs (N)
users (1) ────────< appointment_logs (N)  [changed_by]

Un apunte importante: GoTrue siempre debe conectar directo a Postgres, nunca a través de PgBouncer. GoTrue usa prepared tatements internamente que son incompatibles con el modo transaction de PgBouncer. El pooler es para PostgREST, Storage y Meta — no para Auth. Esto aplica también a la instancia principal si alguna vez necesitas revisarla.
```