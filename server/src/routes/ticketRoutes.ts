import { Router } from "express";
import { createTicketHandler } from "../controllers/ticketController";

const router = Router();

router.post("/tickets/", createTicketHandler);

export default router;
