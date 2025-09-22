# Dificultad de Ramos DCC App (React + Vite + JSON Server)

Aplicación web Dificultad de Ramos DCC con **React** para el frontend y **JSON Server** para simular un backend REST.
Permite comentar, ver y evaluar la dificultad de los ramos DCC.

Esta aplicación permite a estudiantes del Departamento de Ciencias de la Computación compartir y consultar opiniones sobre los ramos de la universidad. Los comentarios pueden ser anónimos o asociados a un usuario (con autenticación opcional), y la comunidad puede validarlos con “estoy de acuerdo” o “no estoy de acuerdo”. El sistema incluye vistas como listado de ramos, opiniones por ramo, perfil de usuario y un panel de administración para moderadores(en proceso).



## Instalación y ejecución
1. Clonar el repositorio: `git clone git@github.com:ZamayaT/proyectoWeb.git`
2. Ingresar a carpeta frontend: `cd proyectoWeb/frontend`
3. Instalar dependencias: `npm install`
4. Ingresar a carpeta backend: `cd ../backend`
5. Levantar JSON Server: `npx json-server --watch db.json --port 3001`
6. Levantar la app en modo desarrollo: `npm run dev`

La aplicación estará disponible en:

- Frontend → http://localhost:5173
    - ruta `/` → Lista de Ramos
    - ruta `/ramo/:id` → Detalle de ramo con comentarios 
- API (JSON Server) → http://localhost:3001
    - GET `/comentarios` → Obtiene todos los comentarios
    - GET `/comentarios/:id` → Obtiene un comentario por ID




## Scripts disponibles
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