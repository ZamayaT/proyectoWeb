import express from "express";
import { getCommentsByCourse, createComment, deleteComment } from "../controllers/commentController";
import { authenticate, verifyCommentOwnerOrAdmin} from "../middleware/authMiddleware";
import config from "../utils/config";

const router = express.Router();

// Obtiene todos los comentarios asociados a un curso
router.get("/course/:id", getCommentsByCourse);

// Crea un comentario
router.post("/", createComment);

// Eliiminar un comentario
router.delete("/:id", authenticate, verifyCommentOwnerOrAdmin, deleteComment);

export default router;