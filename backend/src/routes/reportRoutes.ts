import { Router } from "express";
import {
  getReportsDataHandler,
  getTopEventsHandler,
  getSalesChartHandler,
} from "../controllers/reportController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.get("/reports/data", authenticateToken, verifyAdmin, getReportsDataHandler);
router.get("/reports/top-events", authenticateToken, verifyAdmin, getTopEventsHandler);
router.get("/reports/sales-chart", authenticateToken, verifyAdmin, getSalesChartHandler);

export default router;