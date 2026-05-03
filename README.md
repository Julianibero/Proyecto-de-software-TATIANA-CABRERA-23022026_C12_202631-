# Talento Sin Fronteras - Backend

## Estado actual
Backend funcional con autenticación y gestión de proyectos implementada, conectada a MongoDB Atlas y desplegada en Render.

## Estructura del proyecto
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── proyecto.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── proyecto.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── proyecto.routes.js
│   └── middlewares/
│       └── auth.middleware.js
├── .env (no subir a GitHub)
├── .gitignore
├── package.json
└── index.js
```

## Tecnologías
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + bcryptjs

## Instalación
1. Clonar el repositorio
2. Entrar a la carpeta backend:
```bash
cd backend
```
3. Instalar dependencias:
```bash
npm install
```
4. Crear archivo `.env` basado en `.env.example` y completar las variables
5. Ejecutar el servidor:
```bash
npm run dev
```

## Variables de entorno
Crear un archivo `.env` en la carpeta `backend` con:
```
PORT=3000
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
```

## URL de producción
```
https://proyecto-de-software-tatiana-cabrera.onrender.com
```

## Endpoints disponibles

### Autenticación
| Método | Ruta | Descripción | Token requerido |
|--------|------|-------------|-----------------|
| POST | /api/auth/register | Registro de usuario | No |
| POST | /api/auth/login | Login y obtención de token JWT | No |

### Proyectos
| Método | Ruta | Descripción | Token requerido |
|--------|------|-------------|-----------------|
| GET | /api/proyectos | Listar todos los proyectos | No |
| GET | /api/proyectos/:id | Ver detalle de un proyecto | No |
| POST | /api/proyectos | Crear proyecto | Sí |
| PUT | /api/proyectos/:id | Actualizar proyecto | Sí |
| DELETE | /api/proyectos/:id | Eliminar proyecto | Sí |

### Ejemplo registro
```json
POST /api/auth/register
{
  "nombre": "Usuario Prueba",
  "email": "prueba@test.com",
  "password": "123456",
  "rol": "creador"
}
```

### Ejemplo login
```json
POST /api/auth/login
{
  "email": "prueba@test.com",
  "password": "123456"
}
```

### Ejemplo crear proyecto (requiere token)
```json
POST /api/proyectos
Headers: Authorization: Bearer TU_TOKEN
{
  "titulo": "Mi proyecto",
  "descripcion": "Descripción del proyecto",
  "tecnologias": ["React", "Node.js", "MongoDB"],
  "enlace": "https://github.com/mi-proyecto"
}
```

## En progreso
- Documentación con Swagger

## Pendiente
- Integración con frontend
