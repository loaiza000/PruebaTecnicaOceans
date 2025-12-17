# Oceans Restaurant

Sistema de gestión de productos y órdenes para restaurante

**app** [https://prueba-tecnica-oceans.vercel.app/login](https://prueba-tecnica-oceans.vercel.app/login)

##  Stack Tecnológico

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Base de Datos**: Supabase (PostgreSQL)

##  Instalación Local

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

## Configuración

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

- Autenticación con JWT
- Gestión de productos
- Creación de órdenes
- Dashboard de órdenes
- Roles (Admin y Mesero)

## Estructura del Proyecto

```
backend/
  src/
    controllers/    # Lógica de negocio
    routes/         # Endpoints API
    middleware/     # Autenticación y validación
    helpers/        # Utilidades

frontend/
  src/
    components/     # Componentes React
    context/        # Context API (Auth)
    services/       # Llamadas a API
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden

## Despliegue

- **Frontend**: Vercel
- **Backend**: Render
- **Base de Datos**: Supabase

Configura las variables de entorno en cada plataforma según sea necesario
