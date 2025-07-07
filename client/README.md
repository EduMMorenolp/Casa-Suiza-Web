🎉 Casa Suiza Web – Frontend
Este es el repositorio del frontend de Casa Suiza , una aplicación web desarrollada con Vite + React y estilizada con TailwindCSS . Permite mostrar próximos eventos y vender entradas online, todo desde una interfaz moderna y responsiva.

🧩 Tecnologías utilizadas
React – Para construcción de componentes UI
Vite – Entorno de desarrollo rápido y moderno
Tailwind CSS – Estilos rápidos y responsivos
react-router-dom – Navegación entre páginas
TypeScript (opcional) – Tipado seguro (si lo usaste)
📦 Requisitos previos
Node.js >= 16.x
npm o yarn instalado
🚀 Instalación
# Clona el repositorio
git clone https://github.com/tu-usuario/casasuiza-web.git 
cd casasuiza-web

# Instala dependencias
npm install
🛠 Desarrollo local

# Inicia el servidor de desarrollo
npm run dev
Abre http://localhost:5173 en tu navegador.

📦 Construir para producción
# Genera la versión optimizada para producción
npm run build
Los archivos estarán listos para deploy en la carpeta dist/.

🖥 Scripts disponibles
npm run dev
Iniciar entorno de desarrollo
npm run build
Construir versión de producción
npm run preview
Previsualizar la build local

🗂️ Estructura del proyecto
```bash
src/
├── assets/ 
├── pages/              # Páginas principales
│   ├── Auth/
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx 
│   │   ├── context/
│   │   │   └── AuthContext.tsx 
│   │   └── Admin.tsx
│   ├── Admin/
│   │   ├── components/
│   │   │   ├── AddEventForm.tsx 
│   │   │   ├── Dashboard.tsx 
│   │   │   ├── Events.tsx 
│   │   │   ├── Header.tsx 
│   │   │   ├── Settings.tsx 
│   │   │   ├── Users.tsx 
│   │   │   └── Sidevbar.tsx 
│   │   └── Admin.tsx
│   ├── Home/
│   │   ├── components/
│   │   │   ├── modals/
│   │   │   │   └── BuyModal.tsx
│   │   │   ├── Header.tsx 
│   │   │   ├── EventCard.tsx  
│   │   │   └── Footer.tsx
│   └── └── Home.tsx
├── App.tsx             # Enrutamiento principal
└── main.tsx            # Punto de entrada de React
```
🎨 Paleta de colores
Basados en el logo de Casa Suiza:

Rojo principal : #c9252d
Blanco : #FFFFFF
Negro : #000000
Azul oscuro : #2C3E50
Gris claro : #F7F7F7

🌐 Rutas definidas

Página principal con próximos eventos

💬 Soporte y preguntas
Si necesitas ayuda con:

Integración con backend
Conexión a MercadoPago
Panel de administración
Diseño de nuevas vistas
👉 No dudes en contactarme. ¡Estoy acá para ayudarte!

✅ Próximos pasos
Integrar datos dinámicos desde API
Agregar página de detalle de evento
Configurar panel de administrador
Conectar con MercadoPago