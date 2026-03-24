# 🚀 Backend Express - AI Sign Language Translator

Este proyecto es un servidor backend construido con **Node.js**, **Express** y **Prisma ORM**, desarrollado como parte del curso de Express.js en Platzi. Implementa un sistema completo de **traducción de lenguaje de signos basado en IA** con autenticación JWT y base de datos PostgreSQL.

## 📁 Estructura del proyecto

```
express-platzi/
├── src/
│   ├── app.js                    # Configuración principal de Express
│   ├── server.js                 # Punto de entrada del servidor
│   ├── controllers/              # Controladores de la aplicación
│   │   ├── authController.js     # Controlador de autenticación
│   │   ├── translationController.js  # Controlador de traducciones
│   │   ├── gifController.js      # Controlador de GIFs
│   │   └── adminController.js    # Controlador administrativo
│   ├── config/                   # Configuración
│   │   └── multerConfig.js       # Configuración de carga de videos
│   ├── integrations/
│   │   └── ai/
│   │       └── aiClient.js       # Cliente del microservicio IA
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── auth.js               # Middleware de autenticación JWT
│   │   ├── uploadValidation.js   # Validación de carga de archivos
│   │   ├── errorHandler.js       # Manejo de errores
│   │   └── logger.js             # Logging de requests
│   ├── routes/                   # Definición de rutas
│   │   ├── index.js              # Rutas principales
│   │   ├── auth.js               # Rutas de autenticación
│   │   ├── translations.js       # Rutas de traducciones
│   │   ├── gifs.js               # Rutas de GIFs
│   │   └── admin.js              # Rutas administrativas
│   ├── services/                 # Lógica de negocio
│   │   ├── authServices.js       # Servicios de autenticación
│   │   ├── translationService.js # Servicios de traducción
│   │   ├── gifService.js         # Servicios de GIFs
│   │   └── adminServices.js      # Servicios administrativos
│   ├── utils/                    # Utilidades
│   │   └── validation.js         # Funciones de validación
│   └── generated/                # Cliente Prisma generado
├── prisma/
│   ├── schema.prisma             # Esquema de base de datos
│   ├── seed.js                   # Datos de prueba
│   └── migrations/               # Migraciones de base de datos
├── uploads/                      # Almacenamiento de videos
├── package.json                  # Dependencias y scripts
├── README.md                     # Documentación del proyecto
├── AI-INTEGRATION.md             # Documentación de integración con IA
├── SETUP-GUIDE.md                # Guía de instalación
├── API-REFERENCE.md              # Referencia de API
└── .env                          # Variables de entorno
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

## 🗄️ Modelo de datos

### User (Usuario)

- `id`: Identificador único
- `email`: Correo electrónico único
- `password`: Contraseña hasheada
- `name`: Nombre del usuario
- `createdAt/updatedAt`: Timestamps
- **Relación**: Una usuario puede tener múltiples traducciones

### Translation (Traducción)

- `id`: Identificador único
- `userId`: ID del usuario propietario
- `videoPath`: Ruta del archivo de video almacenado
- `result`: Resultado JSON del microservicio IA (palabras detectadas)
- `createdAt`: Timestamp de creación

### Gif (GIF)

- `id`: Identificador único
- `word`: Palabra (única)
- `gifUrl`: URL del GIF del lenguaje de signos

## 🚀 Instalación y ejecución

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

Crea un archivo `.env` basado en `.env-example`:

```bash
cp .env-example .env
```

Variables requeridas:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT
- `AI_SERVICE_URL`: URL del microservicio IA (default: http://localhost:5000)
- `PORT`: Puerto del servidor (default: 3000)

### 4️⃣ Configurar la base de datos

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate:dev
```

### 5️⃣ Crear directorio de uploads

```bash
mkdir -p uploads
```

### 6️⃣ Iniciar el microservicio IA (en otra terminal)

```bash
python ai_service_example.py
```

### 7️⃣ Ejecutar el servidor

```bash
# Modo desarrollo (con watch)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📌 API Endpoints

### Autenticación

| Método | Ruta                 | Descripción                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Registrar nuevo usuario        |
| POST   | `/api/auth/login`    | Iniciar sesión                 |
| GET    | `/api/auth/profile`  | Obtener perfil (requiere auth) |

### Traducciones (Requiere Autenticación)

| Método | Ruta                      | Descripción                                   |
| ------ | ------------------------- | --------------------------------------------- |
| POST   | `/api/translations`       | Subir video y traducir                        |
| GET    | `/api/translations`       | Obtener historial de traducciones del usuario |
| GET    | `/api/translations/:id`   | Obtener traducción específica                 |
| DELETE | `/api/translations/:id`   | Eliminar traducción                           |
| GET    | `/api/translations/stats` | Obtener estadísticas de traducciones          |

### GIFs

| Método | Ruta                       | Descripción                            |
| ------ | -------------------------- | -------------------------------------- |
| GET    | `/api/gifs/:word`          | Obtener GIF para una palabra (público) |
| GET    | `/api/gifs`                | Listar todos los GIFs (público)        |
| GET    | `/api/gifs/search?q=query` | Buscar GIFs (público)                  |
| POST   | `/api/gifs/batch`          | Obtener múltiples GIFs (requiere auth) |
| POST   | `/api/gifs`                | Crear GIF (admin)                      |
| PUT    | `/api/gifs/:id`            | Actualizar GIF (admin)                 |
| DELETE | `/api/gifs/:id`            | Eliminar GIF (admin)                   |

## 🤖 Sistema de Traducción de Lenguaje de Signos

El backend incluye un sistema completo de **traducción de lenguaje de signos basado en IA**:

### Características

- 📹 **Carga de Videos**: Los usuarios pueden subir videos de lenguaje de signos
- 🤖 **Procesamiento con IA**: Un microservicio Python procesa los videos
- 📝 **Detección de Palabras**: El sistema detecta y traduce a palabras
- 🎞️ **Mapeo a GIFs**: Cada palabra se mapea a un GIF de lenguaje de signos
- 💾 **Historial**: Se almacenan todas las traducciones del usuario

### Flujo de Traducción

```
1. Usuario sube video
   ↓
2. Backend valida y almacena el archivo
   ↓
3. Envía a microservicio IA (Python)
   ↓
4. IA procesa y retorna palabras detectadas
   ↓
5. Se guarda en base de datos
   ↓
6. Frontend obtiene GIFs para cada palabra
   ↓
7. Se muestra traducción en lenguaje de signos
```

### Ejemplo de Uso

```bash
# 1. Registrarse
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123","name":"Usuario"}'

# 2. Iniciar sesión (obtener token)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}' | jq -r '.data.token')

# 3. Subir video para traducir
curl -X POST http://localhost:3000/api/translations \
  -H "Authorization: Bearer $TOKEN" \
  -F "video=@video.mp4"

# 4. Obtener traducciones
curl -X GET http://localhost:3000/api/translations \
  -H "Authorization: Bearer $TOKEN"

# 5. Obtener GIFs para palabras
curl -X POST http://localhost:3000/api/gifs/batch \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"words":["hola","mundo"]}'
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
