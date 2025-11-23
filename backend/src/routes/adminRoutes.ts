import express from "express";
import { getAdmins, getAdminById, createAdmin } from "../controllers/adminController";

const router = express.Router();

// Obtiene todos los usuarios
router.get("api/admin", getAdmins);

// Obtiene un usuario según su id
router.get("api/admin/:id", getAdminById);

// Crea un usuario
router.post("api/admin", createAdmin);

export default router;