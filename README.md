# Dificultad de Ramos DCC App

Aplicación web Dificultad de Ramos DCC con **React + Vite** para el frontend y **Node + express + Mongoose** para el backend. Permite comentar, ver y evaluar la dificultad de los ramos DCC.

Esta aplicación permite a estudiantes del Departamento de Ciencias de la Computación compartir y consultar opiniones sobre los ramos de la universidad. Los comentarios pueden ser anónimos o asociados a un usuario (con autenticación opcional), y la comunidad puede validarlos con “estoy de acuerdo” o “no estoy de acuerdo”. El sistema incluye vistas como listado de ramos, opiniones por ramo, perfil de usuario y un panel de administración para moderadores(en proceso).


## Estructura 
Estructura del estado global (librería usada y stores).

## Rutas
URLs del proyecto

Frontend → http://localhost:5173

- / → Lista de ramos

- /ramo/:id → Detalle del ramo con comentarios(crear y eliminar)

- /admin → Administrar ramos (crear, editar y eliminar). Ruta protegida.

- /login → login, logout y register de usuarios

Backend API → http://localhost:3001/api

- GET /api/courses → Obtiene todos los ramos

- GET /api/courses/electives → Obtener todos los ramos electivos

- GET /api/courses/required → Obtener todos los ramos obligatorio

- GET /api/courses/:id → Obtiene un ramo por ID

- PUT /api/courses/:id → Modifica un ramo por ID (solo rol admin)

- DELETE /api/courses/:id → Elimina un ramo por ID (solo rol admin)

- POST /api/courses → Crea un nuevo ramo (solo rol admin)

- GET /api/comments/course/:id → Obtiene todos los comentarios asociados a un curso

- POST /api/comments → Crea un comentario nuevo

- DELETE /api/comments/:id → Elimina un comentario (rol admin o propietario)

- POST /api/auth/login → Inicia sesión de usuario

- POST /api/auth/logout → Cerrar sesión de usuario

- POST /api/users → Registra un nuevo usuario



## Flujo de autenticación
Flujo de autenticación.


## Tests
Descripción de los tests E2E (herramienta usada, flujos cubiertos).

## Estilos y Diseño
Librería de estilos utilizada y decisiones de diseño.

La librería de estilos utilizada fue **MUI**, que se integró directamente al frontend para mantener el estilo y diseño simple de los mockups realizados en los hitos anteriores, con el color principal siendo una azul claro y la fuente de letra prinicipal *Roboto*.

Para la vista principal (lista de ramos) se mantuvo un diseño simple de trajetas con la información esencial de los ramos: nombre, código, calificación de dificultad y tipo (obligatorio o electivo). Esta vista también contiene filtros de tipo, nombre y cófigo. 

También se incluyó una vista más detallada de un ramo en específico, que permite acceder a los comentarios creados sobre el ramo (donde cualquiera pude comnetar) además de dar la opción de hacer una publicaión bajo el post, considerando esta funcionalidad.

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
    cp .env.example .env
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

## Scripts disponibles (backend)
```bash
npm run dev      # Levanta el servidor en modo desarrollo con nodemon
npm start        # Levanta el servidor en modo producción
npm run seed     # Poblado inicial de la base de datos con ramos
npm run build    # Crea una built del backend para produccion
npm run build:ui # Crea una built del frontend para produccion(linux)
npm run buildwindows:ui # Crea una built del frontend para produccion(windows)
```

## Scripts disponibles (frontend)
```bash
npm run dev      # Levanta la app en modo desarrollo
npm run build    # Genera la build de producción
npm run preview  # Previsualiza la build de producción
```


## Tecnologías utilizadas
- [Vite](https://vitejs.dev/) – Bundler y dev server ultrarrápido
- [React](https://react.dev/) – Biblioteca para interfaces de usuario
- [JSON Server](https://github.com/typicode/json-server) – API fake REST para simular backend


## Estado global (Redux)
La aplicación usa **Redux Toolkit** junto con **react-redux** para manejar el estado global del frontend.

- Slices:
    - `auth`: maneja la sesión (login, logout, `loading`, `error`).
    - `courses`: lista de ramos, operaciones de CRUD.

- Flujo:
    1. Al iniciar la app `App.tsx` despacha `restoreLogin()` y `fetchCourses()` para poblar el store.
    2. `Login.tsx` despacha `login()` que llama al backend; si tiene éxito, se actualiza `auth` y se recupera el perfil del usuario.
    3. Las rutas protegidas usan `state.auth` para controlar visibilidad o redirecciones.
    
## Estructura del proyecto
```bash
├── backend/              # carpeta para Backend(JSON-server)
├── frontend/             # Carpeta para FrontEnd(React)
├── E2E/                  # Carpeta para tests(E2E)
└── README.md
```



##  Tecnologías utilizadas

### **Frontend**
- React + Vite
- React Router
- Axios
- Mui UI

### **Backend**
- Node.js + Express
- Mongoose (MongoDB)
- JWT para autenticación
- Bcrypt para hashing de contraseñas
- Dotenv

---