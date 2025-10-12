import express from "express";
import { getCourses, getCourseById, createCourse } from "../controllers/courseController";

const router = express.Router();

// Obtiene todos los ramos
router.get("/", getCourses);

// Obtiene un ramo según su id
router.get("/:id", getCourseById);

// Crea un ramo
router.post("/", createCourse);

export default router;