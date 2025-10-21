# Dificultad de Ramos DCC App (React + Vite + JSON Server)

Aplicación web Dificultad de Ramos DCC con **React** para el frontend y **JSON Server** para simular un backend REST.
Permite comentar, ver y evaluar la dificultad de los ramos DCC.

Esta aplicación permite a estudiantes del Departamento de Ciencias de la Computación compartir y consultar opiniones sobre los ramos de la universidad. Los comentarios pueden ser anónimos o asociados a un usuario (con autenticación opcional), y la comunidad puede validarlos con “estoy de acuerdo” o “no estoy de acuerdo”. El sistema incluye vistas como listado de ramos, opiniones por ramo, perfil de usuario y un panel de administración para moderadores(en proceso).



## Instalación y ejecución
1. Clonar el repositorio: 
```bash
    git clone git@github.com:ZamayaT/proyectoWeb.git`
```
2. Instalar dependencias del frontend
```bash
    cd proyectoWeb/frontend
    npm install 
```

3. Instalar dependencias del backend
```bash
    cd ../backend
    npm install
```

4. Configurar variables de entorno(cambiar nombre)
```bash
    .env.example -> .env
```

5. (Opcional pero recomendado) Poblar la base de datos con ramos de ejemplo: 
```bash
    npm run seed
```
6. Levantar el backend
```bash
    npm run dev # npm start (en produccion)
    
```

7. Levantar el frontend
```bash
    cd ../frontend
    npm run dev
```

La aplicación estará disponible en:

- Frontend → http://localhost:5173
    - ruta `/` → Lista de Ramos
    - ruta `/ramo/:id` → Detalle de ramo con comentarios 
- API (JSON Server) → http://localhost:3001
    - GET `/comentarios` → Obtiene todos los comentarios
    - GET `/comentarios/:id` → Obtiene un comentario por ID

🌐 URLs del proyecto

Frontend → http://localhost:5173

- / → Lista de ramos

- /ramo/:id → Detalle del ramo con comentarios

- /admin → Administrar ramos (crear y eliminar)

- /login → login, logout y register de usuarios

Backend API → http://localhost:3001/api

- GET /api/courses → Obtiene todos los ramos

- GET /api/courses/:id → Obtiene un ramo por ID

- POST /api/courses → Crea un nuevo ramo

- DELETE /api/courses/:id → Elimina un ramo

- POST /api/auth/login → Inicia sesión de usuario

- POST /api/auth/logout → Cerrar sesión de usuario

- POST /api/users → Registra un nuevo usuario




## Scripts disponibles (backend)
```bash
npm run dev      # Levanta el servidor en modo desarrollo con nodemon
npm start        # Levanta el servidor en modo producción
npm run seed     # Poblado inicial de la base de datos con ramos
```

## Scripts disponibles (backend)
```bash
npm run dev      # Levanta la app en modo desarrollo
npm run build    # Genera la build de producción
npm run preview  # Previsualiza la build de producción
```


## Tecnologías utilizadas
- [Vite](https://vitejs.dev/) – Bundler y dev server ultrarrápido
- [React](https://react.dev/) – Biblioteca para interfaces de usuario
- [JSON Server](https://github.com/typicode/json-server) – API fake REST para simular backend


## Estructura del proyecto
```bash
├── backend/              # carpeta para Backend(JSON-server)
├── frontend/             # Carpeta para FrontEnd(React)
└── README.md
```