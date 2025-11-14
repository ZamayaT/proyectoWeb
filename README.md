# Dificultad de Ramos DCC App

Aplicación web Dificultad de Ramos DCC con **React** para el frontend y **JSON Server** para simular un backend REST.
Permite comentar, ver y evaluar la dificultad de los ramos DCC.

Esta aplicación permite a estudiantes del Departamento de Ciencias de la Computación compartir y consultar opiniones sobre los ramos de la universidad. Los comentarios pueden ser anónimos o asociados a un usuario (con autenticación opcional), y la comunidad puede validarlos con “estoy de acuerdo” o “no estoy de acuerdo”. El sistema incluye vistas como listado de ramos, opiniones por ramo, perfil de usuario y un panel de administración para moderadores(en proceso).


## Estructura 
Estructura del estado global (librería usada y stores).

## Rutas
URLs del proyecto

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



## Flujo de autenticación
Flujo de autenticación.


## Tests E2E

### Descripción
Los tests E2E se implementan con **Playwright** en la carpeta independiente `/e2etests/`. 

Cubren 3 flujos principales:
- **Autenticación**: Login, registro, logout y manejo de sesiones
- **Acceso protegido**: Verificar que las rutas protegidas funcionan correctamente
- **Comentarios**: Crear, listar, validar y persistir comentarios
- **Navegación**: Flujos de navegación entre vistas y redirecciones

### Tests implementados

#### auth.spec.ts (4 tests)
- ✅ Login con credenciales correctas
- ✅ Error con credenciales incorrectas
- ✅ Logout funciona correctamente
- ✅ Registro de nuevo usuario

#### comments.spec.ts (6 tests)
- ✅ Crear comentario como usuario registrado
- ✅ Crear comentario anónimo
- ✅ Persistencia de comentarios (reload)
- ✅ Validación de dificultad requerida
- ✅ Contador de comentarios actualizado
- ✅ Gestión de múltiples comentarios

#### navigation.spec.ts (8 tests)
- ✅ Mostrar ramos en la página principal
- ✅ Navegar a login desde el header
- ✅ Login correcto y mostrar bienvenida
- ✅ Navegar de login a lista de ramos
- ✅ Navegar de lista a detalle de ramo
- ✅ Volver de detalle a lista
- ✅ Navegación desde header
- ✅ Logout funciona correctamente

### Ejecutar tests

**Instalar dependencias:**
```bash
cd e2etests
npm install
```

**Todos los navegadores (chromium, firefox, webkit):**
```bash
npm test
```

**Solo Chromium (más rápido):**
```bash
npm test -- --project chromium
```

**Modo debug (visual):**
```bash
npm test -- --project chromium --debug
```

**Ver reporte HTML:**
```bash
npm run test:report
```

**Solo un archivo específico:**
```bash
npm test -- --project chromium auth.spec.ts
npm test -- --project chromium comments.spec.ts
npm test -- --project chromium navigation.spec.ts
```

### Requisitos para ejecutar tests
- Backend seeded y corriendo: `npm run seed` -> `npm run dev` (desde `/backend`)
- Frontend corriendo: `npm run dev` (desde `/frontend`)
- Endpoint `/api/testing/reset` disponible en modo test para limpiar BD


## Estilos y Diseño
Librería de estilos utilizada y decisiones de diseño.


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
├── e2etests/             # Carpeta para E2E testing (Playwright)
└── README.md
```