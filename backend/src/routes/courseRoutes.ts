import express from "express";
import { getCourses, getCourseById, createCourse, deleteCourse, getElectives, getRequired } from "../controllers/courseController";
import { authenticate, authorizeRole } from "../middleware/authMiddleware";
import config from "../utils/config"

const router = express.Router();

// Obtiene todos los ramos
router.get("/", getCourses);

// Obtiene solo ramos electivos
router.get("/electives", getElectives)

// Obtiene solo ramos obligatorios
router.get("/required", getRequired)

// Obtiene un ramo según su id
router.get("/:id", getCourseById);

// Crea un ramo
router.post("/", authenticate, authorizeRole([config.ROLES.ADMIN]), createCourse);

// Elimina un ramo según su id
router.delete("/:id", authenticate, authorizeRole([config.ROLES.ADMIN]), deleteCourse);

export default router;