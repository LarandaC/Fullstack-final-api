# Fullstack Final — API

REST API para sistema de gestión de inventario. Construida con Node.js, Express y MongoDB siguiendo Clean Architecture y principios SOLID.

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js + TypeScript | 6.0.2 | Runtime + tipado estático |
| Express | 5.2.1 | Framework HTTP |
| Mongoose | 9.3.3 | ODM para MongoDB |
| jsonwebtoken | 9.0.3 | Autenticación JWT |
| bcryptjs | 3.0.3 | Hash de contraseñas |

## Requisitos previos

- Node.js 18+
- MongoDB Atlas o instancia local

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRES_IN=8h          # opcional, default: 8h
```

## Scripts

```bash
npm run dev      # Desarrollo con hot-reload (nodemon + ts-node)
npm run build    # Compilar TypeScript a /dist
npm start        # Producción (requiere build previo)
```

## Arquitectura

El proyecto sigue **Clean Architecture** con capas bien delimitadas e inyección de dependencias manual.

```
src/
├── config/          # Configuración (env, base de datos)
├── models/          # Esquemas Mongoose (capa de datos)
├── interfaces/      # Contratos: repositorios, servicios, políticas
│   ├── repositories/
│   ├── services/
│   └── policies/
├── repositories/    # Acceso a datos (implementan interfaces)
├── services/        # Lógica de negocio (implementan interfaces)
├── policies/        # Reglas de acceso (ej: visibilidad de precios)
├── controllers/     # Manejo HTTP (reciben req, delegan al service)
├── routes/          # Definición de rutas y middlewares
├── middleware/       # Auth, validación, error handling
├── errors/          # AppError personalizado
├── types/           # Roles y constantes de dominio
└── container.ts     # Composición de dependencias (único lugar con new)
```

### Flujo de una request

```
Request → Route → Middleware (auth/validate) → Controller → Service → Repository → MongoDB
                                                                ↓
Response ←─────────────────────────────────────────────────────┘
```

### Principios aplicados

- **SRP**: cada clase tiene una sola razón de cambio
- **DIP**: controllers y services dependen de interfaces, no de implementaciones
- **ISP**: interfaces separadas por contexto (IUserRepository, IStockService, etc.)
- **OCP**: `ProductAccessPolicy` centraliza las reglas de visibilidad sin modificar el controller

## Endpoints

### Autenticación

```
POST /api/auth/register    Registrar usuario
POST /api/auth/login       Iniciar sesión → devuelve JWT
```

### Usuarios *(admin)*

```
GET    /api/users          Listar usuarios
POST   /api/users          Crear usuario
PUT    /api/users/:id      Editar usuario
DELETE /api/users/:id      Eliminar usuario
```

### Productos *(autenticado)*

```
GET    /api/products            Listar con paginación (?page=1&limit=10)
GET    /api/products/:id        Detalle de producto
POST   /api/products            Crear producto          (admin, supervisor)
PUT    /api/products/:id        Editar producto          (admin, supervisor, financiero)
DELETE /api/products/:id        Eliminar producto        (admin)
```

> Los campos de precio (`purchasePrice`, `salePrice`, `iva`) solo se devuelven a roles con acceso financiero.

### Categorías *(autenticado)*

```
GET    /api/categories          Listar categorías
POST   /api/categories          Crear categoría          (admin, supervisor)
PUT    /api/categories/:id      Editar categoría         (admin, supervisor)
DELETE /api/categories/:id      Eliminar categoría       (admin)
```

### Movimientos *(autenticado)*

```
GET    /api/movements                  Listar movimientos
GET    /api/movements/:id              Detalle de movimiento
GET    /api/movements/product/:id      Movimientos por producto

POST   /api/movements/compra           Registrar compra      (admin, financiero)
POST   /api/movements/baja             Registrar baja        (admin, supervisor)

PATCH  /api/movements/:id/approve      Aprobar baja          (admin)
PATCH  /api/movements/:id/reject       Rechazar baja         (admin)
```

## Roles y permisos

| Acción | Admin | Supervisor | Financiero | Inventarista |
|---|:---:|:---:|:---:|:---:|
| Gestionar usuarios | ✓ | | | |
| Crear/editar productos | ✓ | ✓ | | |
| Editar precios | ✓ | | ✓ | |
| Ver precios | ✓ | | ✓ | |
| Registrar compra | ✓ | | ✓ | |
| Registrar baja | ✓ | ✓ | | |
| Aprobar/rechazar baja | ✓ | | | |
| Ver movimientos | ✓ | ✓ | ✓ | ✓ |

## Flujo de movimientos

### Compra
El stock se actualiza **inmediatamente** al registrar la compra. Opcionalmente actualiza precios de compra/venta del producto.

### Baja
1. El supervisor registra la baja → queda en estado `pendiente`
2. El stock **no se modifica** hasta la aprobación
3. El administrador aprueba o rechaza
4. Al aprobar, se re-valida el stock y se descuenta

```
Baja creada → pendiente → aprobado  (stock descontado)
                       → rechazado  (sin cambios)
```
