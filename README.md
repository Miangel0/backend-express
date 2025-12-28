
# 🚀 Backend con Express

Este proyecto es un servidor básico construido con **Node.js** y **Express**, desarrollado para practicar conceptos esenciales del backend como rutas, middlewares, manejo de datos y uso de variables de entorno.


## 📁 Estructura del proyecto

```

backend-express/
├── app.js               # Punto de entrada de la aplicación
├── middlewares/         # Middlewares personalizados
├── utils/               # Funciones y helpers reutilizables
├── users.json           # Archivo que simula una base de datos
├── .env-example         # Variables de entorno de ejemplo
├── package.json         # Configuración del proyecto y dependencias
└── .gitignore           # Archivos ignorados por Git

````

---

## 🛠️ Tecnologías utilizadas

- **Node.js**
- **Express**
- **Nodemon** (para desarrollo)
- **dotenv**

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone git@github.com:Miangel0/backend-express.git
cd backend-express
````

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Crear archivo `.env`

Basado en el archivo `.env-example`:

```bash
cp .env-example .env
```

### 4️⃣ Ejecutar el servidor

```bash
npm run dev
```

⚡ Por defecto, el servidor se ejecuta en:

```
http://localhost:3000
```

---

## 📌 Características principales

* Servidor funcional con Express.
* Manejo básico de rutas.
* Middlewares personalizados.
* Lectura de datos desde un archivo JSON externo (`users.json`).
* Implementación de variables de entorno con dotenv.

---

## 📫 Endpoints (ejemplos)

> *⚠️ Ajusta esto si tus rutas cambian según avances el proyecto.*

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

| Variable  | Descripción                               |
|-----------|---------------------------------------------|
| PORT      | Puerto donde corre el servidor             |
| NODE_ENV  | Entorno de ejecución (`development` o `production`) |

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


