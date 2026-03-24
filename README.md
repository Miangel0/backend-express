# 🚀 Backend Express - AI Sign Language Translator

Backend construido con **Node.js**, **Express** y **Prisma ORM** que implementa un sistema completo de **traducción de lenguaje de signos basado en IA**. Incluye autenticación JWT, gestión de usuarios, almacenamiento de videos e integración con un microservicio de inteligencia artificial.

---

## 📱 GUÍA RÁPIDA: Conecta tu Frontend

### 1️⃣ URL de la API

```javascript
const API_URL = "http://localhost:3005/api";
```

### 2️⃣ CORS - Frontend en puerto diferente

Si tu app está en `http://localhost:8081`, ya está permitida.  
Si está en otro puerto, edita [src/app.js](src/app.js):

```javascript
app.use(
  cors({
    origin: "http://localhost:TUpuerto", // Cambia
    credentials: true,
  }),
);
```

### 3️⃣ Headers para Requests

### 1. URL Base del Backend

```javascript
// En tu frontend
const API_URL = "http://localhost:3000/api";
```

### 2. Configuración de CORS

✅ **Habilitado**: El backend permite solicitudes desde `http://localhost:8081`  
Si tu frontend está en otro puerto, actualiza el archivo `src/app.js`:

```javascript
app.use(
  cors({
    origin: "http://TU-FRONTEND-URL:PUERTO", // Cambia esto
    credentials: true,
  }),
);
```

### 3. Headers Requeridos

Para todas las solicitudes autenticadas, incluye:

```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
}
```

Para carga de videos, usa `FormData` (sin `Content-Type`, el navegador lo configura automáticamente):

```javascript
const formData = new FormData();
formData.append("video", videoFile); // File object

fetch(`${API_URL}/translations`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

## 📁 Estructura del proyecto

```
express-platzi/
├── src/
│   ├── app.js                         # Configuración principal de Express
│   ├── server.js                      # Punto de entrada del servidor
│   ├── controllers/                   # Controladores de la aplicación
│   │   ├── authController.js          # Autenticación (registro, login)
│   │   ├── translationController.js   # Traducciones de videos
│   │   └── adminController.js         # Funciones administrativas
│   ├── config/                        # Configuración
│   │   └── multerConfig.js            # Configuración de carga de videos
│   ├── integrations/
│   │   └── ai/
│   │       └── aiClient.js            # Cliente del microservicio IA
│   ├── middlewares/                   # Middlewares personalizados
│   │   ├── auth.js                    # Validación de JWT
│   │   ├── uploadValidation.js        # Validación de videos
│   │   ├── errorHandler.js            # Manejo centralizado de errores
│   │   └── logger.js                  # Logging de requests
│   ├── routes/                        # Definición de rutas
│   │   ├── index.js                   # Rutas principales
│   │   ├── auth.js                    # /api/auth
│   │   ├── translations.js            # /api/translations
│   │   └── admin.js                   # /api/admin
│   ├── services/                      # Lógica de negocio
│   │   ├── authServices.js            # Lógica de autenticación
│   │   ├── translationService.js      # Lógica de traducciones
│   │   └── adminServices.js           # Lógica administrativa
│   ├── utils/                         # Utilidades
│   │   └── validation.js              # Funciones de validación
│   └── generated/                     # Cliente Prisma generado
├── prisma/
│   ├── schema.prisma                  # Esquema de base de datos
│   ├── seed.js                        # Datos de prueba
│   └── migrations/                    # Migraciones de base de datos
├── uploads/                           # Almacenamiento de videos
├── package.json                       # Dependencias y scripts
├── README.md                          # Este archivo
├── .env                               # Variables de entorno
└── .env.example                       # Plantilla de variables
```

## 🛠️ Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Prisma ORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación basada en tokens
- **Multer** - Manejo de carga de videos
- **Axios** - Cliente HTTP para microservicio IA
- **bcrypt** - Hashing de contraseñas
- **dotenv** - Gestión de variables de entorno

## 🗄️ Modelo de Datos

### User (Usuario)

- `id`: Identificador único (autoincrement)
- `email`: Correo electrónico único
- `password`: Contraseña hasheada con bcrypt
- `name`: Nombre del usuario
- `role`: Rol del usuario (USER o ADMIN)
- `createdAt/updatedAt`: Timestamps automáticos

**Relación**: Un usuario puede tener múltiples traducciones

### Translation (Traducción)

- `id`: Identificador único
- `userId`: ID del usuario propietario (clave foránea)
- `videoPath`: Ruta del archivo de video almacenado
- `result`: Resultado JSON del microservicio IA con palabras detectadas
- `createdAt`: Timestamp de creación

**Ejemplo de resultado:**

```json
{
  "words": ["hola", "mundo", "¿cómo", "estás?"],
  "confidence": [0.95, 0.92, 0.88, 0.91]
}
```

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone <repository-url>
cd express-platzi
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crea un archivo `.env`:

```bash
# Variables del servidor
PORT=3005
NODE_ENV=production

# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd?schema=public"

# Autenticación JWT
JWT_SECRET=tu-clave-secreta-muy-segura

# Microservicio IA
AI_SERVICE_URL=microserviceia-production.up.railway.app
AI_SERVICE_TIMEOUT=300000
```

**Variables requeridas:**

| Variable         | Descripción         | Ejemplo                                    |
| ---------------- | ------------------- | ------------------------------------------ |
| `DATABASE_URL`   | Conexión PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`     | Clave para JWT      | Cualquier string aleatorio seguro          |
| `AI_SERVICE_URL` | URL del API IA      | `service.railway.app` (sin https://)       |
| `PORT`           | Puerto del servidor | `3005`                                     |

### 4️⃣ Configurar la base de datos

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate:dev

# (Opcional) Ver datos en Prisma Studio
npm run prisma:studio
```

### 5️⃣ Iniciar el servidor

```bash
# Desarrollo (con reload automático)
npm run dev

# Producción
npm start
```

✅ El servidor estará disponible en: `http://localhost:3005`

## 📌 Documentación de API

### 🔑 Autenticación

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token_jwt>
```

#### POST `/api/auth/register` - Registrar usuario

```javascript
// Request
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "Juan Pérez"
}

// Response (201)
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Juan Pérez",
    "role": "USER"
  }
}
```

#### POST `/api/auth/login` - Iniciar sesión

```javascript
// Request
{
  "email": "user@example.com",
  "password": "secure123"
}

// Response (200)
{
  "success": true,
  "message": "Sesión iniciada",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

#### GET `/api/auth/profile` - Obtener perfil (Requiere Auth)

```javascript
// Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Juan Pérez",
    "role": "USER",
    "createdAt": "2026-03-24T10:30:00Z"
  }
}
```

---

### 📹 Traducciones (Todas requieren autenticación)

#### POST `/api/translations` - Subir video para traducir

```bash
# Con FormData (desde JavaScript)
const formData = new FormData();
formData.append('video', videoFile); // File object

fetch('http://localhost:3005/api/translations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer TOKEN'
  },
  body: formData
});

# Respuesta (201)
{
  "success": true,
  "message": "Video procesado exitosamente",
  "data": {
    "id": 5,
    "userId": 1,
    "videoPath": "/uploads/video_1711270200000.mp4",
    "result": {
      "words": ["hola", "mundo"],
      "confidence": [0.95, 0.92]
    },
    "createdAt": "2026-03-24T10:45:00Z"
  }
}
```

#### GET `/api/translations` - Obtener historial del usuario

```javascript
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": 5,
      "userId": 1,
      "videoPath": "/uploads/video_1711270200000.mp4",
      "result": {
        "words": ["hola", "mundo"],
        "confidence": [0.95, 0.92]
      },
      "createdAt": "2026-03-24T10:45:00Z"
    },
    // ... más traducciones
  ]
}
```

#### GET `/api/translations/:id` - Obtener traducción específica

```javascript
// Response (200)
{
  "success": true,
  "data": {
    "id": 5,
    "userId": 1,
    "videoPath": "/uploads/video_1711270200000.mp4",
    "result": {
      "words": ["hola", "mundo"],
      "confidence": [0.95, 0.92]
    },
    "createdAt": "2026-03-24T10:45:00Z"
  }
}
```

#### DELETE `/api/translations/:id` - Eliminar traducción

```javascript
// Response (200)
{
  "success": true,
  "message": "Traducción eliminada exitosamente"
}
```

#### GET `/api/translations/stats` - Obtener estadísticas

```javascript
// Response (200)
{
  "success": true,
  "data": {
    "totalTranslations": 15,
    "averageWordsDetected": 8.5,
    "totalWordsProcessed": 127
  }
}
```

---

### ⚙️ Admin (Requiere rol ADMIN)

#### GET `/api/admin/users` - Listar todos los usuarios

```javascript
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "Usuario 1",
      "role": "USER",
      "translationCount": 5
    },
    // ... más usuarios
  ]
}
```

#### GET `/api/admin/stats` - Estadísticas del sistema

```javascript
// Response (200)
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "totalTranslations": 45,
    "activeUsers": 7
  }
}
```

## 🤖 Sistema de Traducción de Lenguaje de Signos

El backend procesa videos de lenguaje de signos usando un **microservicio de IA** en Python alojado en Railway.

### Flujo de Procesamiento

```
1. Usuario sube video
   ↓
2. Backend valida el archivo
   ↓
3. Se almacena en /uploads
   ↓
4. Se envía al microservicio IA (microserviceia-production.up.railway.app)
   ↓
5. IA procesa el video y detecta palabras
   ↓
6. Resultado se guarda en la base de datos
   ↓
7. Frontend obtiene las palabras traducidas
```

### Ejemplo de Integración en Frontend

```javascript
// 1. Registrar usuario
const registerResponse = await fetch(
  "http://localhost:3005/api/auth/register",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "secure123",
      name: "Usuario",
    }),
  },
);

// 2. Iniciar sesión
const loginResponse = await fetch("http://localhost:3005/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "secure123",
  }),
});
const loginData = await loginResponse.json();
const token = loginData.data.token;

// 3. Subir video para traducir
const videoFormData = new FormData();
videoFormData.append("video", videoFile); // Tu input:file

const translationResponse = await fetch(
  "http://localhost:3005/api/translations",
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: videoFormData,
  },
);
const translationData = await translationResponse.json();
const words = translationData.data.result.words; // ["hola", "mundo", ...]

// 4. Mostrar palabras en tu aplicación
console.log("Palabras detectadas:", words);
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Los endpoints protegidos requieren un token válido en el header:

```
Authorization: Bearer <token>
```

## 📊 Prisma Studio

Para visualizar y gestionar los datos de la base de datos:

```bash
npm run prisma:studio
```

Esto abrirá Prisma Studio en el navegador.

## � AI Sign Language Translator (NEW!)

Este backend ahora incluye un sistema completo de **traducción de lenguaje de signos basado en IA**:

### Características de Traducción

- 📹 **Carga de Videos**: Los usuarios pueden subir videos de lenguaje de signos
- 🤖 **Procesamiento con IA**: Un microservicio Python procesa los videos
- 📝 **Detección de Palabras**: El sistema detecta y traduce a palabras
- 🎞️ **Mapeo a GIFs**: Cada palabra se mapea a un GIF de lenguaje de signos
- 💾 **Historial**: Se almacenan todas las traducciones del usuario

### Endpoints de Traducción

**POST /api/translations** - Subir video para traducir

```bash
curl -X POST http://localhost:3000/api/translations \
  -H "Authorization: Bearer TOKEN" \
  -F "video=@video.mp4"
```

**GET /api/translations** - Obtener historial de traducciones

```bash
curl -X GET http://localhost:3000/api/translations \
  -H "Authorization: Bearer TOKEN"
```

### Endpoints de GIFs

**GET /api/gifs/:word** - Obtener GIF para una palabra

```bash
curl http://localhost:3000/api/gifs/hola
```

**POST /api/gifs/batch** - Obtener múltiples GIFs

```bash
curl -X POST http://localhost:3000/api/gifs/batch \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"words": ["hola", "mundo"]}'
```

### Configuración Requerida

Para usar el sistema de traducción, necesitas:

1. Instalar dependencias nuevas: `npm install`
2. Configurar variables de entorno en `.env`
3. Ejecutar migraciones de base de datos: `npm run prisma:migrate:dev`
4. Iniciar el microservicio de IA en puerto 5000

Ver [AI-INTEGRATION.md](./AI-INTEGRATION.md) y [SETUP-GUIDE.md](./SETUP-GUIDE.md) para más detalles.

## 🧪 Scripts disponibles

```bash
npm run dev              # Servidor con watch mode
npm start                # Servidor en producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate:dev   # Ejecutar migraciones en desarrollo
npm run prisma:migrate:deploy # Ejecutar migraciones en producción
npm run prisma:studio    # Abrir Prisma Studio
```

## 📝 Características principales

- ✅ Autenticación JWT con roles (user/admin)
- ✅ Gestión completa de reservas y citas
- ✅ **Traducción de lenguaje de signos con IA** (NUEVO)
- ✅ **Carga de videos y mapeo a GIFs** (NUEVO)
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ Logging de requests
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Migraciones de base de datos
- ✅ Hashing seguro de contraseñas
- ✅ Arquitectura MVC (Model-View-Controller)
- ✅ Middlewares personalizados

## 📚 Documentación Adicional

- [AI-INTEGRATION.md](./AI-INTEGRATION.md) - Documentación completa del sistema de AI
- [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Guía paso a paso de instalación y configuración
- [ai_service_example.py](./ai_service_example.py) - Ejemplo de microservicio Python

## �🧪 Scripts disponibles

```bash
npm run dev              # Servidor con watch mode
npm start                # Servidor en producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate:dev   # Ejecutar migraciones en desarrollo
npm run prisma:migrate:deploy # Ejecutar migraciones en producción
npm run prisma:studio    # Abrir Prisma Studio
```

## 📝 Características principales

- ✅ Autenticación JWT con roles (user/admin)
- ✅ Gestión completa de reservas y citas
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ Logging de requests
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Migraciones de base de datos
- ✅ Hashing seguro de contraseñas
- ✅ Arquitectura MVC (Model-View-Controller)
- ✅ Middlewares personalizados

## 🤝 Contribución

Este proyecto fue desarrollado como parte del curso de Express.js en Platzi. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Miguel Angel Sandoval** - _Desarrollador Backend_

---

_Proyecto desarrollado como parte del curso de Express.js en Platzi_

```
http://localhost:3000
```

---

## 📌 Características principales

- Servidor funcional con Express.
- Manejo básico de rutas.
- Middlewares personalizados.
- Lectura de datos desde un archivo JSON externo (`users.json`).
- Implementación de variables de entorno con dotenv.

---

## 📫 Endpoints (ejemplos)

> _⚠️ Ajusta esto si tus rutas cambian según avances el proyecto._

| Método | Ruta     | Descripción                         |
| ------ | -------- | ----------------------------------- |
| GET    | `/`      | Respuesta base del servidor         |
| GET    | `/users` | Obtiene usuarios desde `users.json` |
| POST   | `/users` | (Ejemplo) Crear un nuevo usuario    |

---

## 📌 Scripts disponibles

```bash
npm start     # Inicia el servidor normal
npm run dev   # Inicia el servidor con nodemon para desarrollo
```

---

## 🧩 Variables de entorno

| Variable | Descripción                                         |
| -------- | --------------------------------------------------- |
| PORT     | Puerto donde corre el servidor                      |
| NODE_ENV | Entorno de ejecución (`development` o `production`) |

---

## 🤝 Contribuciones

Si deseas contribuir, siéntete libre de hacer un **fork** del proyecto, crear una nueva rama y enviar un **pull request**.
¡Toda sugerencia o mejora es bienvenida! 😄

---

## 📄 Licencia

Este proyecto está bajo la **MIT License**.
Puedes usarlo y modificarlo libremente.

---

## 👨‍💻 Autor

**Miguel (Miangel0)**
GitHub: [https://github.com/Miangel0](https://github.com/Miangel0)
