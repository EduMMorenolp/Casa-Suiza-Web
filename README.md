# 🏠 Casa Suiza – Plataforma de Eventos Online

**Casa Suiza** es una plataforma web para la visualización, gestión y venta de entradas de eventos culturales, desarrollada con un stack moderno y pensada para ofrecer una experiencia rápida, intuitiva y accesible para todos los usuarios.

## ✨ Funcionalidades principales

- 🗓️ Mostrar eventos próximos desde una página pública
- 🎟️ Compra de entradas online (MercadoPago)
- 🔒 Panel de administración con login protegido
- 🧑‍💼 Gestión de eventos, usuarios y configuración desde el dashboard
- 📱 Interfaz responsive adaptada a dispositivos móviles

## 🧩 Tecnologías utilizadas

### 🔷 Frontend

- **Vite + React** – Renderizado moderno y veloz
- **Tailwind CSS** – Estilado basado en utilidades
- **React Router DOM** – Enrutamiento dinámico
- **TypeScript** (opcional)

### 🔶 Backend *(en desarrollo)*

- **Node.js + Express** – API REST
- **Base de datos**: MongoDB o MySQL (a definir)
- **JWT** – Autenticación con tokens
- **MercadoPago SDK** – Integración para pagos

## 🔐 Autenticación y seguridad

- Autenticación de administrador mediante JWT
- Rutas protegidas con `ProtectedRoute` en el frontend
- Middleware de autorización en el backend

## 💸 Integración con MercadoPago

La plataforma está diseñada para integrar pagos mediante **Checkout Pro de MercadoPago**, permitiendo a los usuarios comprar entradas de forma rápida y segura.

## 🎨 Paleta de colores

Basado en los colores oficiales de Casa Suiza:

| Color         | Hex       |
|---------------|-----------|
| Rojo principal| `#c9252d` |
| Blanco        | `#FFFFFF` |
| Negro         | `#000000` |
| Azul oscuro   | `#2C3E50` |
| Gris claro    | `#F7F7F7` |

## 🚀 Próximas mejoras

- [ ] Página de detalle por evento
- [ ] Filtro de eventos por categoría o fecha
- [ ] Ticket digital con QR al comprar
- [ ] Registro de asistentes
- [ ] Dashboard más completo para estadísticas
- [ ] Deploy del backend y frontend (Vercel, Netlify, Railway)

## 📬 Contacto y soporte

¿Querés colaborar o tenés dudas?

📧 **Contacto:** [https://linktr.ee/emmorenolp]  

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia [MIT](LICENSE).