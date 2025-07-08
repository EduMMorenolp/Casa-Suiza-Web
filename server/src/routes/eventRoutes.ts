import { Router } from "express";
import {
  createEventHandler,
  getEventByIdHandler,
  updateEventHandler,
  deleteEventHandler,
  listEventsHandler,
} from "../controllers/eventController";

const router = Router();

router.post("/event", createEventHandler); 
router.get("/events/:id", getEventByIdHandler); 
router.put("/events/:id", updateEventHandler); 
router.delete("/events/:id", deleteEventHandler); 
router.get("/events", listEventsHandler); // Listar eventos con filtros opcionales

export default router;
