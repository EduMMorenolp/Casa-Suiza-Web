# 📚 Casa Suiza - Documentación Técnica y Manual de Usuario

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router DOM

**Backend:**
- Node.js + Express
- Prisma ORM
- MySQL Database
- JWT Authentication

**Integraciones:**
- MercadoPago Payment Gateway
- Nodemailer (Gmail SMTP)
- QRCode Generation

## 📁 Estructura del Proyecto

```
Casa Suiza Web/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   │   ├── Auth/      # Autenticación
│   │   │   └── Home/      # Página principal y compras
│   │   ├── api/           # Cliente API
│   │   └── utils/         # Utilidades
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── config/        # Configuraciones
│   │   ├── controllers/   # Controladores
│   │   ├── services/      # Lógica de negocio
│   │   ├── routes/        # Rutas API
│   │   └── utils/         # Utilidades
└── prisma/               # Schema de base de datos
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- Cuenta de MercadoPago (Sandbox)
- Cuenta de Gmail con App Password

### 1. Configuración del Backend

```bash
cd "Casa Suiza Web/server"
npm install
```

**Variables de entorno (.env):**
```env
DATABASE_URL="mysql://root:root@localhost:3306/casasuiza"
PORT=3000
JWT_SECRET=yoursecretkey
CLIENT_URL="http://localhost:5173"
MP_ACCESS_TOKEN="TEST-tu-token-de-mercadopago"
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASS="tu-app-password"
```

**Configurar base de datos:**
```bash
npx prisma migrate dev
npx prisma generate
```

### 2. Configuración del Frontend

```bash
cd "Casa Suiza Web/client"
npm install
```

### 3. Ejecutar el proyecto

**Backend:**
```bash
cd server && npm run dev
```

**Frontend:**
```bash
cd client && npm run dev
```

## 🔐 Sistema de Autenticación

### AuthContext
- Manejo de estado de usuario
- Persistencia en localStorage
- Login/logout automático

### Rutas Protegidas
- Dashboard administrativo protegido con JWT
- Middleware de autorización en backend

## 💳 Sistema de Pagos

### Flujo de Compra
1. Usuario selecciona evento y cantidad
2. Completa formulario de compra
3. Elige método de pago (Wallet/Tarjeta)
4. MercadoPago procesa el pago
5. Sistema actualiza orden y tickets
6. Envía email de confirmación con QR

### Configuración MercadoPago
```typescript
// config/mercadoPago.ts
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});
```

### Estados de Pago
- `PENDING`: Pago pendiente
- `COMPLETED`: Pago aprobado
- `FAILED`: Pago rechazado

## 📧 Sistema de Emails

### Configuración Gmail
1. Habilitar autenticación de 2 factores
2. Generar App Password
3. Configurar variables de entorno

### Email de Confirmación
- Se envía automáticamente al aprobar pago
- Incluye detalles de compra
- Contiene QR code como entrada digital

## 📱 Generación de QR Codes

### Implementación
```typescript
import QRCode from 'qrcode';

export const generateQRCode = async (paymentId: string): Promise<string> => {
  return await QRCode.toDataURL(paymentId);
};
```

### Uso
- QR contiene ID de pago
- Se incluye en email como imagen
- Permite verificación en evento

## 🗄️ Base de Datos

### Modelos Principales

**User**
- id, email, password, role, createdAt

**Event**
- id, title, description, date, price, capacity, status

**Order**
- id, userId, eventId, quantity, totalAmount, status, buyerInfo

**Ticket**
- id, orderId, eventId, status, qrCode

**Payment**
- id, orderId, amount, method, status, mpPaymentId

## 🔧 API Endpoints

### Autenticación
- `POST /api/v1/auth/login` - Login de usuario
- `POST /api/v1/auth/register` - Registro de usuario

### Eventos
- `GET /api/v1/events` - Listar eventos
- `POST /api/v1/events` - Crear evento (admin)
- `PUT /api/v1/events/:id` - Actualizar evento (admin)

### Órdenes
- `POST /api/v1/orders` - Crear orden
- `GET /api/v1/orders/:id` - Obtener orden

### Pagos
- `POST /api/v1/payment/create-preference` - Crear preferencia MP
- `POST /api/v1/payment/process` - Procesar pago
- `POST /api/v1/payment/webhook` - Webhook MP

## 👥 Manual de Usuario

### Para Usuarios Finales

#### 1. Comprar Entradas
1. Navegar a la página principal
2. Seleccionar evento deseado
3. Hacer clic en "Comprar Entradas"
4. Completar formulario:
   - Nombre y apellido
   - Email
   - DNI
   - Teléfono (opcional)
   - Cantidad de entradas
5. Elegir método de pago
6. Completar pago en MercadoPago
7. Recibir email de confirmación con QR

#### 2. Verificar Compra
- Revisar email de confirmación
- Guardar QR code para el evento
- Contactar soporte si hay problemas

### Para Administradores

#### 1. Acceso al Dashboard
1. Ir a `/login`
2. Ingresar credenciales de administrador
3. Acceder al panel de control

#### 2. Gestión de Eventos
- Crear nuevos eventos
- Editar eventos existentes
- Ver estadísticas de ventas
- Gestionar capacidad

#### 3. Gestión de Órdenes
- Ver todas las órdenes
- Filtrar por estado
- Verificar pagos
- Gestionar reembolsos

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a base de datos:**
- Verificar que MySQL esté ejecutándose
- Comprobar credenciales en DATABASE_URL

**Pagos no se procesan:**
- Verificar token de MercadoPago
- Comprobar configuración de webhook
- Revisar logs del servidor

**Emails no se envían:**
- Verificar credenciales de Gmail
- Comprobar App Password
- Revisar configuración SMTP

### Logs y Debugging
- Backend logs en consola del servidor
- Frontend logs en DevTools del navegador
- Logs de MercadoPago en dashboard

## 🔒 Seguridad

### Mejores Prácticas Implementadas
- JWT para autenticación
- Validación de datos en backend
- Sanitización de inputs
- CORS configurado
- Variables de entorno para secretos

### Recomendaciones
- Usar HTTPS en producción
- Implementar rate limiting
- Validar webhooks de MercadoPago
- Backup regular de base de datos

## 🚀 Deployment

### Preparación para Producción
1. Configurar variables de entorno de producción
2. Usar tokens reales de MercadoPago
3. Configurar dominio para webhooks
4. Optimizar build del frontend
5. Configurar SSL/HTTPS

### Plataformas Recomendadas
- **Frontend:** Vercel, Netlify
- **Backend:** Railway, Heroku, DigitalOcean
- **Base de datos:** PlanetScale, AWS RDS

## 📞 Soporte

Para soporte técnico o consultas:
- **Desarrollador:** [https://linktr.ee/emmorenolp]
- **Documentación:** Este archivo
- **Issues:** Crear issue en el repositorio

---

*Última actualización: Enero 2024*