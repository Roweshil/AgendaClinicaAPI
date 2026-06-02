# AgendaClinicaAPI

Backend de **Agenda Clínica** — producto de [RoweWorks](https://api.roweshil.com).
API REST para la gestión de citas médicas con autenticación por roles, construida sobre Node.js /Express y desplegada en Render.

---

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Base de datos | Turso (SQLite distribuido) |
| Autenticación | JWT + cookies httpOnly |
| Validación | Zod |
| Seguridad | Helmet, express-rate-limit |
| Deploy | Render |

---

## Features

- Autenticación con JWT stateless — tokens en cookies httpOnly y firmadas
- Autorización por roles — Admin y Médico
- CRUD completo de citas con validación de datos
- Actualización automática de estatus via cron jobs
- Rate limiting en endpoints críticos
- Protección contra XSS, CSRF y SQL injection
- Arquitectura limpia — controladores, modelos y rutas separados
- Manejo de errores profesional centralizado
---

## Roles

| Rol | Descripción |
|---|---|
| `admin` | Gestión global del sistema |
| `medico` | Gestión de su propia agenda y citas |

> Rol `paciente` planeado para versiones futuras — permitirá autoagendado.

---

## Estructura del proyecto

```
AgendaClinicaAPI/

  controladores/     # lógica de negocio por dominio
  crons/             # actualizacion automatica de BD
  DB/                # conexiones a base de datos
  middlewares/       # auth, validación, rate limit, cors
  modelo/            # manejo de base de datos
  routes/            # definición de endpoints
  schemas/           # esquemas Zod
  services/          # logica de login por rol
  utils/             # sanitizador, manejo de errores
  index.js           # entrada principal
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
# Base de datos
DB_URL=
DB_TOKEN=

# Autenticación
JWT_SECRET=
SALT_ROUNDS=
COOKIE_SECRET=

# Servidor
PORT=
NODE_ENV= production / development

# CORS
FRONT_URL=

# Google Calendar
CLIENT_ID=
APIKEY=
```

---

## Instalación local

```bash
# clonar el repositorio
git clone https://github.com/roweshil/AgendaClinicaAPI.git
cd AgendaClinicaAPI

# instalar dependencias
npm install

# configurar variables de entorno
cp .env.example .env
# edita .env con tus valores

# iniciar en desarrollo
npm run dev
```

---

## Deploy

El proyecto está desplegado en **Render**.

Configuración requerida en Render:
- Agregar todas las variables de entorno del `.env`
- Activar `trust proxy` — ya configurado en `index.js`

---

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT en cookies httpOnly — no accesibles desde JavaScript del cliente
- Cookies Firmadas Criptográficamente (Signed Cookies): Las cookies viajan acompañadas de una firma digital única
- Helmet para headers HTTP seguros
- Rate limiting en `/api/auth/login` — máximo 5 intentos por IP en 15 minutos
- Validación de inputs con Zod en todos los endpoints y queries
- Protocolo de manejo de errores y resilencia (Error Handling)

---

## Roadmap

El proyecto está en **desarrollo activo**. Este es el estado de las funcionalidades planificadas

- [ ] Implementacion de Redis para Refresh Token
- [ ] Bloqueo de cuenta por intentos fallidos en base de datos
- [ ] Notificaciones automáticas via WhatsApp/email
- [ ] Rol paciente con autoagendado
- [ ] Documentación Swagger
- [ ] Testing con Jest
- [ ] Integración con Google Calendar API
---

## Producto

**Agenda Clínica** es parte del ecosistema **RoweWorks** — productos de software construidos y operados de forma independiente.
