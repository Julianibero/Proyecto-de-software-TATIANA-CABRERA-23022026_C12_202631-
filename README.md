# 🎨 Talento Sin Fronteras

> Red social digital especializada para creadores, makers y profesionales creativos.  
> **Stack:** Node.js · Express · MongoDB Atlas · JWT · React  
> **Backend:** https://proyecto-de-software-tatiana-cabrera.onrender.com  
> **Swagger:** https://proyecto-de-software-tatiana-cabrera.onrender.com/api-docs  
> **Frontend:** https://github.com/Cristianamc3/talento-sin-fronteras-front  
> **Jira:** https://estudiante-team-ljyhfraw.atlassian.net/jira/software/projects/TALENTO2/boards/101/backlog

> ⚠️ **Nota:** El servidor backend está desplegado en Render con el plan gratuito. Si los endpoints no responden de inmediato, espera **1-2 minutos** mientras el servidor se activa y vuelve a intentarlo.

---

## 📋 Tabla de Contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Documentación de API](#documentación-de-api)
- [Pruebas](#pruebas)
- [Docker](#docker)
- [Equipo](#equipo)

---

## Descripción del proyecto

**Talento Sin Fronteras** es una plataforma digital que conecta creadores independientes, estudiantes y profesionales del ecosistema creativo y tecnológico. Permite publicar portafolios, colaborar en proyectos y recibir retroalimentación entre pares, eliminando barreras geográficas para el talento emergente en Latinoamérica.

### Problema que resuelve

Los creadores de contenido técnico y creativo carecen de un espacio unificado donde puedan:
- Exhibir su portafolio de forma profesional
- Recibir retroalimentación técnica de otros creadores
- Colaborar en proyectos con personas de perfiles complementarios
- Acceder a mentorías estructuradas

### Solución implementada

Una plataforma web con backend RESTful y frontend en React que integra autenticación segura con JWT, gestión de proyectos creativos y documentación completa de la API mediante Swagger.

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (React)                         │
│                  [Vercel — Frontend]                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API REST (Express)                        │
│               [Render — Backend]                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Routes     │  │ Controllers  │  │   Middlewares    │  │
│  │ /auth        │  │ auth.ctrl    │  │ auth.middleware  │  │
│  │ /proyectos   │  │ proyecto.ctrl│  │ (verifica JWT)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Modelos (Mongoose)                 │   │
│  │         User.model.js    |    Proyecto.model.js      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose ODM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Atlas (Cloud)                      │
│         Colecciones: users | proyectos                      │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de autenticación

```
Cliente → POST /api/auth/login → Valida credenciales → Genera JWT (7d)
       → Headers: Authorization: Bearer <token>
       → Middleware verifica JWT → Permite acceso a rutas protegidas
```

---

## Tecnologías utilizadas

| Categoría      | Tecnología         | Versión  | Uso                                      |
|----------------|--------------------|----------|------------------------------------------|
| Runtime        | Node.js            | 18.x     | Entorno de ejecución del servidor        |
| Framework      | Express            | 4.18.x   | Manejo de rutas y middleware HTTP        |
| Base de datos  | MongoDB Atlas      | 7.x      | Almacenamiento persistente en la nube    |
| ODM            | Mongoose           | 7.6.x    | Modelado de datos y validaciones         |
| Autenticación  | JWT (jsonwebtoken) | 9.x      | Tokens de sesión seguros                 |
| Cifrado        | bcryptjs           | 2.4.x    | Hash de contraseñas                      |
| Documentación  | Swagger            | 6.x      | Documentación interactiva de la API      |
| Frontend       | React              | 18.x     | Interfaz de usuario                      |
| Testing unit.  | Jest               | 29.x     | Pruebas unitarias e integración          |
| Testing HTTP   | Supertest          | 6.x      | Pruebas de endpoints REST                |
| CI/CD          | GitHub Actions     | —        | Pipeline de integración continua         |
| Deploy backend | Render             | —        | Hosting del servidor en producción       |
| Deploy front   | Vercel             | —        | Hosting del frontend React               |

---

## Instalación local

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x
- Cuenta en MongoDB Atlas (o MongoDB local)

### Pasos

```bash
# 1. Clonar el repositorio backend
git clone https://github.com/Julianibero/Proyecto-de-software-TATIANA-CABRERA-23022026_C12_202631-.git
cd Proyecto-de-software-TATIANA-CABRERA-23022026_C12_202631-

# 2. Ingresar a la carpeta del backend
cd backend

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 5. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor quedará disponible en: `http://localhost:3000`  
La documentación Swagger estará en: `http://localhost:3000/api-docs`

---

## Variables de entorno

Crear el archivo `backend/.env` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/tsf_db
JWT_SECRET=tu_secreto_muy_largo_y_seguro_aqui
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Está incluido en `.gitignore`.

---

## Documentación de API

Documentación interactiva disponible en:  
🔗 **https://proyecto-de-software-tatiana-cabrera.onrender.com/api-docs**

### Base URL

- **Producción:** `https://proyecto-de-software-tatiana-cabrera.onrender.com`
- **Local:** `http://localhost:3000`

---

### 🔐 Módulo de Autenticación

#### `POST /api/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**

```json
{
  "nombre": "string (requerido)",
  "email": "string (requerido, formato email)",
  "password": "string (requerido, mín. 6 caracteres)",
  "rol": "string (requerido: 'creador' | 'mentor' | 'empresa')"
}
```

**Ejemplo:**

```bash
curl -X POST https://proyecto-de-software-tatiana-cabrera.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Julian Vega",
    "email": "julian@ejemplo.com",
    "password": "MiPassword123",
    "rol": "creador"
  }'
```

**Respuestas:**

| Código | Descripción                           |
|--------|---------------------------------------|
| `201`  | Usuario registrado exitosamente       |
| `400`  | Datos inválidos o email ya registrado |
| `500`  | Error interno del servidor            |

**Response 201:**

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "nombre": "Julian Vega",
    "email": "julian@ejemplo.com",
    "rol": "creador"
  }
}
```

---

#### `POST /api/auth/login`

Autentica un usuario y retorna un token JWT.

**Request Body:**

```json
{
  "email": "string (requerido)",
  "password": "string (requerido)"
}
```

**Ejemplo:**

```bash
curl -X POST https://proyecto-de-software-tatiana-cabrera.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prueba@test.com",
    "password": "123456"
  }'
```

**Respuestas:**

| Código | Descripción                    |
|--------|--------------------------------|
| `200`  | Login exitoso, retorna JWT     |
| `400`  | Credenciales incorrectas       |
| `404`  | Usuario no encontrado          |
| `500`  | Error interno del servidor     |

**Response 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "nombre": "Julian Vega",
    "email": "julian@ejemplo.com",
    "rol": "creador"
  }
}
```

> 💡 El token tiene vigencia de **7 días**. Úsalo en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.

---

### 📁 Módulo de Proyectos

| Método   | Ruta               | Descripción                | Token requerido |
|----------|--------------------|----------------------------|-----------------|
| `GET`    | /api/proyectos     | Listar todos los proyectos | No              |
| `GET`    | /api/proyectos/:id | Ver detalle de un proyecto | No              |
| `POST`   | /api/proyectos     | Crear proyecto             | Sí              |
| `PUT`    | /api/proyectos/:id | Actualizar proyecto        | Sí              |
| `DELETE` | /api/proyectos/:id | Eliminar proyecto          | Sí              |

**Ejemplo crear proyecto:**

```bash
curl -X POST https://proyecto-de-software-tatiana-cabrera.onrender.com/api/proyectos \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi proyecto",
    "descripcion": "Descripción del proyecto",
    "tecnologias": ["React", "Node.js", "MongoDB"],
    "enlace": "https://github.com/mi-proyecto"
  }'
```

**Usuario de prueba:**
- Email: `prueba@test.com`
- Password: `123456`

---

## Pruebas

```bash
# Pruebas unitarias con cobertura
npm run test:unit

# Pruebas de integración
npm run test:integration
```

### Resultados

| Tipo        | Herramienta | Cantidad | Resultado |
|-------------|-------------|----------|-----------|
| Unitarias   | Jest        | 15 tests | ✅ PASS   |
| Integración | Supertest   | 8 tests  | ✅ PASS   |

Los archivos de prueba se encuentran en la carpeta `backend/tests/`.

---

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

```bash
# Ejecutar localmente con Docker
docker-compose up --build
```

---

## Equipo

| Nombre                  | Rol                     | Correo                           |
|-------------------------|-------------------------|----------------------------------|
| Luisa Verónica Cruz     | Product Owne / Scrum Master / Analista | lcruzve1@estudiante.ibero.edu.co |
| Cristian Steven Abril   | Developer fronetd  | cabrilal@estudiante.ibero.edu.co |
| Julian Vega Joya        | Developer Backend /  Documentador / QA | jvegajoy@estudiante.ibero.edu.co |

---

*Corporación Universitaria Iberoamericana — Ingeniería de Software — 2026*
