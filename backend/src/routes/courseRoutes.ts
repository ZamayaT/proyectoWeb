import express from "express";
import { getCourses, getCourseById, createCourse, deleteCourse } from "../controllers/courseController";
import { authenticate, authorizeRole } from "../middleware/authMiddleware";
import config from "../utils/config"

const router = express.Router();

// Obtiene todos los ramos
router.get("/", getCourses);

// Obtiene un ramo según su id
router.get("/:id", getCourseById);

// Crea un ramo
router.post("/", authenticate, authorizeRole([config.ROLES.ADMIN]), createCourse);

// Elimina un ramo según su id
router.delete("/:id", authenticate, authorizeRole([config.ROLES.ADMIN]), deleteCourse);

export default router;