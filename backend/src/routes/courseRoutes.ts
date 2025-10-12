import express from "express";
import { getCourses, getCourseById, createCourse } from "../controllers/courseController";

const router = express.Router();

// Obtiene todos los ramos
router.get("api/course", getCourses);

// Obtiene un ramo según su id
router.get("api/course/:id", getCourseById);

// Crea un usuario
router.post("api/course", createCourse);

export default router;