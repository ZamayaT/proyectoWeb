# Dificultad de Ramos DCC App

Aplicación web Dificultad de Ramos DCC con **React + Vite** para el frontend y **Node + express + Mongoose** para el backend. Permite comentar, ver y evaluar la dificultad de los ramos DCC.

Esta aplicación permite a estudiantes del Departamento de Ciencias de la Computación compartir y consultar opiniones sobre los ramos de la universidad. Los comentarios pueden ser anónimos o asociados a un usuario (con autenticación opcional), y la comunidad puede validarlos con “estoy de acuerdo” o “no estoy de acuerdo”. El sistema incluye vistas como listado de ramos, opiniones por ramo, perfil de usuario y un panel de administración para moderadores (en proceso).



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



## Flujo de Autenticación

La aplicación implementa un sistema de autenticación basado en **JWT + CSRF tokens** para máxima seguridad.

### Arquitectura de Seguridad

#### 1. **Autenticación con JWT (HTTP-only cookies)**
- El backend genera un token JWT al hacer login y lo envía como **cookie HTTP-only**
- El token no es accesible desde JavaScript (protección contra XSS)
- Se envía automáticamente en cada petición con `withCredentials: true`

#### 2. **Protección CSRF**
- Además del JWT, el backend envía un **CSRF token** en el header `X-CSRF-Token`
- El frontend guarda este token en `localStorage`
- Todas las peticiones POST/PUT/DELETE incluyen el CSRF token mediante `axiosSecure` (interceptor)

### Flujo Completo

#### Login
1. Usuario ingresa credenciales en `/login`
2. Frontend envía `POST /api/auth/login` con username/password
3. Backend valida y responde con:
   - JWT en cookie HTTP-only (`Set-Cookie`)
   - CSRF token en header `X-CSRF-Token`
4. Frontend guarda el CSRF token en `localStorage`
5. Redux actualiza el estado con `setUser(user)`

#### Restauración de Sesión
1. Al cargar la app, `App.tsx` ejecuta `restoreLogin()`
2. Frontend envía `GET /api/auth/login/me` con:
   - JWT (automático vía cookie)
   - CSRF token (vía header)
3. Si es válido, backend devuelve datos del usuario
4. Redux actualiza el estado con `setUser(user)`

#### Peticiones Protegidas
- Todas las operaciones sensibles usan `axiosSecure`:
  - Crear/editar/eliminar cursos (admin)
  - Crear/eliminar comentarios
  - Operaciones de autenticación
- `axiosSecure` automáticamente incluye el CSRF token en headers

#### Logout
1. Usuario hace clic en "Logout"
2. Frontend envía `POST /api/auth/logout`
3. Backend invalida la cookie JWT
4. Frontend elimina el CSRF token de `localStorage`
5. Redux ejecuta `clearUser()`

### Protección de Rutas

#### Ruta Protegida: `/admin`
```tsx
<Route 
  path="/admin" 
  element={
    (user && user.role === "admin") 
      ? <Admin /> 
      : <Navigate to={user ? "/" : "/login"} replace />
  } 
/>
```

- Solo usuarios con `role: "admin"` pueden acceder
- Usuarios sin autenticar son redirigidos a `/login`
- Usuarios autenticados sin permisos van a `/`

#### Rutas Públicas
- `/` - Lista de ramos (sin autenticación)
- `/ramo/:id` - Detalle de ramo (comentarios anónimos permitidos)
- `/login` - Página de autenticación

### Manejo de Errores
- Credenciales incorrectas → mensaje de error en UI
- Token expirado → redirección automática a login
- Sin permisos → redirección según rol

## Tests E2E

### Descripción
Los tests E2E se implementan con **Playwright** en la carpeta independiente `/e2etests/`. 

Cubren los siguientes flujos principales:
- **Autenticación**: Login, registro, logout y manejo de sesiones
- **Acceso protegido**: Verificar que las rutas protegidas funcionan correctamente
- **Comentarios**: Crear, listar, eliminar y persistir comentarios
- **Navegación**: Flujos de navegación entre vistas y redirecciones
- **Búsqueda**: Filtrado de ramos por nombre, código y tipo
- **CRUD de Cursos**: Crear, leer, editar y eliminar cursos (admin)

### Tests implementados (43 tests)

#### auth.spec.ts (4 tests)
- Login con credenciales correctas
- Error con credenciales incorrectas
- Logout funciona correctamente
- Registro de nuevo usuario

#### comments.spec.ts (5 tests)
- Crear comentario como usuario registrado
- Crear comentario anónimo
- Persistencia de comentarios (reload)
- Validación de dificultad requerida
- Contador de comentarios actualizado

#### comment-delete.spec.ts (6 tests)
- Usuario puede eliminar su propio comentario
- El contador de comentarios se actualiza al eliminar
- Admin puede eliminar comentarios de otros usuarios
- Se requiere confirmación antes de eliminar
- Cancelar eliminación mantiene el comentario
- Comentarios anónimos pueden ser eliminados por su autor

#### navigation.spec.ts (9 tests)
- Mostrar ramos en la página principal
- Navegar a login desde el header
- Login correcto y mostrar bienvenida
- Navegar de login a lista de ramos
- Navegar de lista a detalle de ramo
- Volver de detalle a lista
- Navegación desde header
- Mostrar bienvenida con usuario después del login
- Logout funciona correctamente

#### search.spec.ts (6 tests)
- Buscar ramos por nombre
- Buscar ramos por código
- Mostrar sin resultados cuando no hay coincidencias
- Limpiar búsqueda y mostrar todos los ramos
- Búsqueda case-insensitive
- Búsqueda funciona con filtro de tipo aplicado

#### course-crud.spec.ts (13 tests)
- Admin puede acceder al panel de administración
- Usuario normal no ve el link al panel de administración
- Usuario no autenticado no puede crear cursos
- Admin puede crear un nuevo curso obligatorio
- Admin puede crear un curso electivo
- No permite crear curso sin nombre o código
- Admin puede cancelar la creación de curso
- Admin puede ver la lista de cursos
- Admin puede editar el nombre de un curso
- Admin puede cambiar un curso de obligatorio a electivo
- Admin puede cerrar el modal sin guardar cambios
- Admin puede eliminar un curso
- Cancelar eliminación mantiene el curso

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
npm test -- --project chromium search.spec.ts
npm test -- --project chromium comment-delete.spec.ts
npm test -- --project chromium course-crud.spec.ts
```

### Requisitos para ejecutar tests

1. **Backend en modo test** (desde `/backend`):
```bash
   npm run start:test
```
   Esto habilita el endpoint `/api/testing/reset` que resetea la BD entre tests.

2. **Frontend corriendo** (desde `/frontend`):
```bash
   npm run dev
```

3. **Base de datos de test**: Los tests usan una BD separada (`test_dificultadRamos`) configurada en `.env`:
```
   TEST_MONGODB_URI=mongodb://127.0.0.1:27017/test_dificultadRamos
```

**Nota**: Los tests se ejecutan con `workers: 1` para evitar race conditions en la base de datos.

## Estilos y Diseño
La librería de estilos utilizada en el proyecto fue Material UI (MUI). Se eligió por sobre otras opciones debido a su integración simple y nativa con React, que permitió mantener los estilos establecidos por los mockups presentados en los hitos anteriores.

Para el diseño general de la aplicación, se decidió mantener una interfaz simple y fácil de navegar, que permitiera presentar la información necesaria sin abrumar a los usuarios. Para esto se escogieron colores más neutros para el contenido textual, agregando justo el color necesario para resaltar ciertos títulos y elementos interactivos; como por ejemplo el color rojo para destacar acciones de cierre y borrado.

Además, se incluyeron efectos visuales típicos para mejorar la experiencia de usuario; el resaltado de los elementos al pasar/mover el cursor por encima, transiciones suaves de los distintos elementos gráficos (como menú desplegables) y más.

Todo esto considerando una distribución *responsive*, que se ajusta automaticamente a los distintos tamaños de pantalla, permitiendo mantener una configuración uniforme.

### Listado de Ramos (página principal)

Para el contenido de la página principal, la lista de ramos, se decidió ocupar tarjetas (Card) para presentar la información más importante de cada ramo de manera simple, lo que permite visualizar: Nombre, Código, Tipo y Dificultad.

Además, se integraron filtros para poder buscar por nombre o código (filtro textual genérico) o categorizar según el tipo (obligatorio o electivo)

### Detalle de un Ramo
Para la vista específica de un ramo se mantuvo un diseño simple y centrado en mostrar solo la información esencial. En la parte superior se muestran los datos principales del curso, seguidos de una lista de comentarios realizados por los usuarios. Cada comentario incluye su respectiva calificación de dificultad, la cual se resalta con un color distinto según el nivel seleccionado.

Además, esta vista incorpora la opción de publicar un nuevo comentario, ya sea de manera anónima o utilizando el nombre de usuario asociado a la sesión actual. Este formulario se encuentra dentro de un menú desplegable inicialmente cerrado, con el objetivo de evitar que ocupe espacio innecesario, manteniendo la interfaz limpia.

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
npm run dev         # Levanta el servidor en modo desarrollo con nodemon
npm start           # Levanta el servidor en modo producción
npm run start:test  # Levanta el servidor en modo test (para E2E tests)
npm run seed        # Poblado inicial de la base de datos con ramos
npm run build       # Crea una build del backend para producción
npm run build:ui    # Crea una build del frontend para producción (Linux)
npm run buildwindows:ui # Crea una build del frontend para producción (Windows)
```

## Scripts disponibles (frontend)
```bash
npm run dev      # Levanta la app en modo desarrollo
npm run build    # Genera la build de producción
npm run preview  # Previsualiza la build de producción
```


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
├── backend/              # Backend (Node.js + Express + MongoDB)
├── frontend/             # Carpeta para FrontEnd(React)
├── e2etests/             # Carpeta para E2E testing (Playwright)
└── README.md
```



##  Tecnologías utilizadas

### **Frontend**
- React + Vite
- React Router
- Redux Toolkit + react-redux
- Axios
- [Material UI (MUI)](https://mui.com/)

### **Backend**
- Node.js + Express
- Mongoose (MongoDB)
- JWT para autenticación
- Bcrypt para hashing de contraseñas
- Dotenv

### **Testing**
- Playwright (E2E testing)

## Despliegue en Producción

La aplicación está desplegada en el servidor de la universidad:

**URL**: http://fullstack.dcc.uchile.cl:7188

### Instrucciones de deployment

1. Clonar el repositorio en el servidor
2. Configurar variables de entorno en `backend/.env` (usar `.env.example` como referencia)
   - Importante: configurar `PORT=7188` para el puerto asignado
3. Instalar dependencias y hacer build:
```bash
cd backend
npm install
npm run build

cd ../frontend
npm install
npm run build
npm run build:ui  # Copia el dist de frontend al backend (en servidor Linux)
```
4. Iniciar el servidor en modo producción:
```bash
cd backend
NODE_ENV=production npm start
