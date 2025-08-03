// ./src/app.ts

import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middleware/corsMiddleware";

// Import Middleware
import { errorHandler } from "./middleware/errorHandler";

// Import Routes
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import eventRoutes from "./routes/eventRoutes";
import subscriberRoutes from "./routes/subscriberRoutes";
import couponRoutes from "./routes/couponRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import reportRoutes from "./routes/reportRoutes";

// Configuracion
dotenv.config();
const app = express();
app.use(express.json());

// Aplicar el middleware de CORS
app.use(corsMiddleware);

// Swagger
// @ts-ignore
import setupSwaggerV1 from "../swagger/v1/main";
setupSwaggerV1(app);

// Morgan
import morgan from "morgan";
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

const BASE_PATH = process.env.BASE_PATH || "";
const VERSIONS_API = process.env.VERSIONS_API || "";
const API_PREFIX = `/${BASE_PATH}/${VERSIONS_API}`;

// Routes
app.use(
  API_PREFIX,
  authRoutes,
  userRoutes,
  adminRoutes,
  ticketRoutes,
  paymentRoutes,
  eventRoutes,
  subscriberRoutes,
  couponRoutes,
  orderRoutes,
  categoryRoutes,
  reportRoutes
);

// Middleware para manejar errores
app.use(errorHandler);

export default app;
