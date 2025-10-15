import express from 'express';
import { getCurrentUser, login, logout } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/login/me", authenticate, getCurrentUser)

router.post("/login", login)

router.post("/logout", logout)

export default router;

