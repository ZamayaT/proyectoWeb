import express from "express";
import { getCommentsByCourse, createComment } from "../controllers/commentController";

const router = express.Router();

// Obtiene todos los comentarios asociados a un ramo
router.get("api/comment/:id", getCommentsByCourse);

// Crea un comentario
router.post("api/comment", createComment);

export default router;