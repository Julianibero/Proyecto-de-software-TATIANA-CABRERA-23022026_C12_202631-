# 🎨 Talento Sin Fronteras — Backend

> Red social digital especializada para creadores, makers y profesionales creativos.  
> **Stack:** Node.js · Express · MongoDB Atlas · JWT · Mongoose  
> **Producción:** https://proyecto-de-software-tatiana-cabrera.onrender.com

---

## 📋 Tabla de Contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Documentación de API (Swagger)](#documentación-de-api)
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

Un backend RESTful que provee los servicios de autenticación y gestión de proyectos, listos para ser consumidos por el frontend en React.

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
| Testing unit.  | Jest               | 29.x     | Pruebas unitarias e integración          |
| Testing HTTP   | Supertest          | 6.x      | Pruebas de endpoints REST                |
| Testing E2E    | Playwright         | 1.40.x   | Pruebas de flujos de usuario             |
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
# 1. Clonar el repositorio
git clone https://github.com/Julianibero/Proyecto-de-software-TATIANA-CABRERA-23022026_C12_202631-.git
cd Proyecto-de-software-TATIANA-CABRERA-23022026_C12_202631-

# 2. Ingresar a la carpeta del backend
cd backend

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (ver sección Variables de entorno)

# 5. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor quedará disponible en: `http://localhost:3000`

---

## Variables de entorno

Crear el archivo `backend/.env` con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Conexión a MongoDB Atlas
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/tsf_db

# Secreto para firma de tokens JWT (mínimo 32 caracteres)
JWT_SECRET=tu_secreto_muy_largo_y_seguro_aqui

# (Solo para pruebas de integración)
MONGODB_URI_TEST=mongodb://localhost:27017/tsf_test
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Está incluido en `.gitignore`.

---

## Documentación de API

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

| Código | Descripción                                  |
|--------|----------------------------------------------|
| `201`  | Usuario registrado exitosamente              |
| `400`  | Datos inválidos o email ya registrado        |
| `500`  | Error interno del servidor                   |

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
    "email": "julian@ejemplo.com",
    "password": "MiPassword123"
  }'
```

**Respuestas:**

| Código | Descripción                                  |
|--------|----------------------------------------------|
| `200`  | Login exitoso, retorna token JWT             |
| `401`  | Credenciales incorrectas                     |
| `404`  | Usuario no encontrado                        |
| `500`  | Error interno del servidor                   |

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

> 💡 El token tiene una vigencia de **7 días**. Debe incluirse en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.

---

### 📁 Módulo de Proyectos

#### `GET /api/proyectos`

Lista todos los proyectos publicados. **No requiere autenticación.**

**Query params opcionales:**

| Parámetro | Tipo   | Descripción                          |
|-----------|--------|--------------------------------------|
| `page`    | number | Página (default: 1)                  |
| `limit`   | number | Resultados por página (default: 10)  |

**Ejemplo:**

```bash
curl https://proyecto-de-software-tatiana-cabrera.onrender.com/api/proyectos
```

**Response 200:**

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "titulo": "Mi Portfolio App",
    "descripcion": "Aplicación de portafolio para diseñadores",
    "tecnologias": ["React", "Node.js", "MongoDB"],
    "enlace": "https://github.com/usuario/portfolio",
    "autor": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2025-06-01T12:00:00.000Z"
  }
]
```

---

#### `GET /api/proyectos/:id`

Retorna el detalle de un proyecto específico. **No requiere autenticación.**

**Path params:**

| Parámetro | Tipo   | Descripción         |
|-----------|--------|---------------------|
| `id`      | string | ID de MongoDB       |

**Respuestas:**

| Código | Descripción                   |
|--------|-------------------------------|
| `200`  | Proyecto encontrado           |
| `404`  | Proyecto no encontrado        |
| `400`  | ID con formato inválido       |

---

#### `POST /api/proyectos`

Crea un nuevo proyecto. **🔒 Requiere token JWT.**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "titulo": "string (requerido)",
  "descripcion": "string (requerido)",
  "tecnologias": ["string"] ,
  "enlace": "string (opcional, URL)"
}
```

**Ejemplo:**

```bash
curl -X POST https://proyecto-de-software-tatiana-cabrera.onrender.com/api/proyectos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi proyecto",
    "descripcion": "Descripción del proyecto",
    "tecnologias": ["React", "Node.js", "MongoDB"],
    "enlace": "https://github.com/mi-proyecto"
  }'
```

**Respuestas:**

| Código | Descripción                   |
|--------|-------------------------------|
| `201`  | Proyecto creado exitosamente  |
| `400`  | Datos inválidos               |
| `401`  | Token no proporcionado        |
| `403`  | Token inválido o expirado     |

---

#### `PUT /api/proyectos/:id`

Actualiza un proyecto existente. **🔒 Requiere token JWT (solo el autor).**

**Request Body:** (todos los campos son opcionales)

```json
{
  "titulo": "string",
  "descripcion": "string",
  "tecnologias": ["string"],
  "enlace": "string"
}
```

**Respuestas:**

| Código | Descripción                              |
|--------|------------------------------------------|
| `200`  | Proyecto actualizado                     |
| `401`  | No autenticado                           |
| `403`  | Sin permiso (no es el autor)             |
| `404`  | Proyecto no encontrado                   |

---

#### `DELETE /api/proyectos/:id`

Elimina un proyecto. **🔒 Requiere token JWT (solo el autor).**

**Respuestas:**

| Código | Descripción                              |
|--------|------------------------------------------|
| `200`  | Proyecto eliminado exitosamente          |
| `401`  | No autenticado                           |
| `403`  | Sin permiso (no es el autor)             |
| `404`  | Proyecto no encontrado                   |

---

## Pruebas

```bash
# Ejecutar todas las pruebas unitarias + cobertura
npm test

# Solo pruebas unitarias
npm run test:unit

# Pruebas de integración (requiere MongoDB local o Atlas TEST)
npm run test:integration

# Pruebas E2E con Playwright
npx playwright install  # primera vez
npm run test:e2e
```

### Cobertura objetivo

| Tipo           | Herramienta | Cantidad | Cobertura |
|----------------|-------------|----------|-----------|
| Unitarias      | Jest        | 15 tests | ≥ 85%     |
| Integración    | Supertest   | 9 tests  | —         |
| End-to-End     | Playwright  | 8 tests  | —         |

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

### docker-compose.yml (ejecución local)

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
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

**Ejecutar localmente con Docker:**

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

---

## Equipo

| Nombre                     | Rol                    | Correo                              |
|----------------------------|------------------------|-------------------------------------|
| Hector Daniel Parra        | Product Owner          | hparram1@estudiante.ibero.edu.co    |
| Juan David Ortiz Bravo     | Scrum Master / Analista| jortizbr@estudiante.ibero.edu.co    |
| Luisa Verónica Cruz        | Developer Frontend     | lcruzve1@estudiante.ibero.edu.co    |
| Cristian Steven Abril      | Developer Backend      | cabrilal@estudiante.ibero.edu.co    |
| Julian Vega Joya           | Documentador / QA      | jvegajoy@estudiante.ibero.edu.co    |

---

*Corporación Universitaria Iberoamericana — Ingeniería de Software — 2026*


