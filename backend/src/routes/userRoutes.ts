import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController";

const router = express.Router();

// Obtiene todos los usuarios
router.get("api/user", getUsers);

// Obtiene un usuario según su id
router.get("api/user/:id", getUserById);

// Crea un usuario
router.post("api/user", createUser);

export default router;