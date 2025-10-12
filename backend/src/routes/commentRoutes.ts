import express from "express";
import { getCommentsByCourse, createComment } from "../controllers/commentController";

const router = express.Router();

// Obtiene todos los comentarios asociados a un curso
router.get("/course/:id", getCommentsByCourse);

// Crea un comentario
router.post("/", createComment);

export default router;