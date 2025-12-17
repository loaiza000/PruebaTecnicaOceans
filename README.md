# Oceans Restaurant

Sistema de gestion de productos y ordenes para restaurante

##  Stack Tecnologico

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Base de Datos**: Supabase (PostgreSQL)

##  Instalacion Local

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Configuracion

### Backend (.env)
```env
PORT=3000
SUPABASE_URL=your_supabase_url
API_KEY_SUPABASE=your_supabase_key
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## Base de Datos

Crea las siguientes tablas en Supabase:

**users**
- id (UUID)
- email (VARCHAR)
- password (VARCHAR)
- nombre (VARCHAR)
- rol (VARCHAR) - 'admin' o 'mesero'
- activo (BOOLEAN)
- created_at (TIMESTAMP)

**products**
- id (UUID)
- nombre (VARCHAR)
- precio (DECIMAL)
- activo (BOOLEAN)
- created_at (TIMESTAMP)

**orders**
- id (UUID)
- productos (JSONB)
- total (DECIMAL)
- created_at (TIMESTAMP)

## Funcionalidades

### Autenticacion
- Login con JWT
- Roles (Admin y Mesero)
- Proteccion de rutas

### Gestion de Productos
- Crear productos
- Buscar productos por nombre
- Editar productos (nombre y precio)
- Listar todos los productos

### Gestion de Ordenes
- Crear ordenes con multiples productos
- Editar ordenes (agregar/quitar productos, cambiar cantidades)
- Buscar ordenes por ID o nombre de producto
- Dashboard de ordenes
- Calculo automatico de totales

## Estructura del Proyecto

```
backend/
  src/
    controllers/    # Logica de negocio
    routes/         # Endpoints API
    middleware/     # Autenticacion y validacion
    helpers/        # Utilidades (response, error handling)
    models/         # Esquemas de datos (documentacion)
    config/         # Configuracion de entorno

frontend/
  src/
    components/     # Componentes React
    context/        # Context API (Auth)
```

## API Endpoints

### Autenticacion
- `POST /api/auth/login` - Iniciar sesion
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Obtener perfil del usuario
- `GET /api/auth/users` - Listar usuarios (solo admin)

### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/search?nombre={nombre}` - Buscar productos por nombre
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - **Actualizar producto**

### Ordenes
- `GET /api/orders` - Listar todas las ordenes
- `GET /api/orders/search?productoNombre={nombre}` - Buscar ordenes por producto
- `GET /api/orders/:id` - Obtener orden por ID
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id` - **Actualizar orden**

## Despliegue

- **Frontend**: Vercel
- **Backend**: Render
- **Base de Datos**: Supabase

Configura las variables de entorno en cada plataforma segun sea necesario

