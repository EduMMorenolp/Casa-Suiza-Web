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
bash


1
2
3
4
5
6
# Clona el repositorio
git clone https://github.com/tu-usuario/casasuiza-web.git 
cd casasuiza-web

# Instala dependencias
npm install
🛠 Desarrollo local
bash


1
2
# Inicia el servidor de desarrollo
npm run dev
Abre http://localhost:5173 en tu navegador.

📦 Construir para producción
bash


1
2
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
├── components/         # Componentes reutilizables
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── EventCard.jsx
│   └── Footer.jsx
├── pages/              # Páginas principales
│   └── Home.jsx
├── App.jsx             # Enrutamiento principal
└── main.jsx            # Punto de entrada de React
```
🎨 Paleta de colores
Basados en el logo de Casa Suiza:

Rojo principal : #FF0000
Blanco : #FFFFFF
Negro : #000000
Azul oscuro : #2C3E50
Gris claro : #F7F7F7
🌐 Rutas definidas
/
Página principal con próximos eventos
/eventos/:id
Detalle de evento (pendiente de implementar)
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
Implementar carrito de compras
Configurar panel de administrador
Conectar con MercadoPago