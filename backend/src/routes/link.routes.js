import { Router } from "express";
import { listLinks, createLink, deleteLink } from "../controllers/link.controller.js";

const router = Router();

router.get("/links", listLinks);
router.post("/links", createLink);
router.delete("/links/:id", deleteLink);

export default router;
