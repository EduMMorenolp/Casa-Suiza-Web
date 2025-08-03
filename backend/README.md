# 🧠 Casa Suiza – Backend

Este es el backend de **Casa Suiza**, una plataforma para la gestión y venta de entradas de eventos culturales. Está construido con **Node.js + Express**, con autenticación mediante JWT, integración con **MercadoPago** y una API RESTful lista para conectar con el frontend.

## ⚙️ Tecnologías utilizadas

- **Node.js** – Entorno de ejecución JavaScript
- **Express** – Framework para crear APIs REST
- **JWT** – Autenticación basada en tokens
- **bcryptjs** – Hashing de contraseñas
- **MongoDB / MySQL** – Base de datos (según configuración)
- **dotenv** – Manejo de variables de entorno
- **MercadoPago SDK** – Pasarela de pagos online

## 🔐 Autenticación

- Registro y login de administradores
- Generación y validación de JWT
- Middleware de autorización para proteger rutas privadas

## 📂 Estructura del proyecto

```bash
server/
├── src/
│   ├── config/
│   │   ├── mercadoPago.ts
│   │   └── prismaClient.ts
│   ├── controllers/
│   │   ├── adminController.ts
│   │   ├── authController.ts
│   │   ├── eventController.ts
│   │   ├── paymentController.ts
│   │   ├── ticketController.ts
│   │   └── userController.ts
│   ├── middlewares/
│   │   ├── authTokenMiddleware.ts
│   │   ├── checkUserActiveMiddleware.ts
│   │   ├── corsMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── verifyAdmin.ts
│   ├── repositories/
│   │   ├── authRepository.ts
│   │   └── userRepository.ts
│   ├── routes/
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── eventRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── ticketRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   ├── adminService.ts
│   │   ├── authService.ts
│   │   ├── eventService.ts
│   │   ├── paymentService.ts
│   │   ├── ticketService.ts
│   │   └── userService.ts
│   ├── utils/
│   │   ├── bcrypt.ts
│   │   ├── CustomError.ts
│   │   └── jwt.ts
│   ├── validation/
│   │   ├── authValidate.ts
│   │   └── userValidate.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── swagger/
│   ├── components/
│   ├── paths/
│   └── README.md
├── .env
├── tsconfig.json
└── package.json
```

## 🧪 Endpoints principales

| Método | Ruta             | Descripción                     |
| ------ | ---------------- | ------------------------------- |
| POST   | `/auth/register` | Registro de nuevo admin         |
| POST   | `/auth/login`    | Login y obtención de token JWT  |
| GET    | `/events`        | Listado de eventos públicos     |
| POST   | `/events`        | Crear evento (requiere auth)    |
| PUT    | `/events/:id`    | Editar evento (requiere auth)   |
| DELETE | `/events/:id`    | Eliminar evento (requiere auth) |
| POST   | `/checkout`      | Generar preferencia de pago MP  |

## 💳 Integración con MercadoPago

La API incluye endpoints para:

- Crear preferencia de pago
- Webhook de notificaciones
- Confirmación de compra
- Generación de entradas digitales (opcional)

> ⚠️ Requiere configurar las credenciales en el archivo `.env`
