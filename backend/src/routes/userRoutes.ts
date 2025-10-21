import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController";

const router = express.Router();

// Obtiene todos los usuarios
router.get("/", getUsers);

// Obtiene un usuario según su id
router.get("/:id", getUserById);

// Crea un usuario
router.post("/", createUser);

export default router;