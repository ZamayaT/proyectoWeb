import { Request, Response, NextFunction } from 'express';
import config from '../utils/config';
import jwt from "jsonwebtoken"
import { UserModel } from '../models/user';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req;
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "missing token" });
  } else {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const csrfToken = req.headers["x-csrf-token"];
    if (
      typeof decodedToken === "object" &&
      decodedToken.id &&
      decodedToken.csrf == csrfToken
    ) {
      authReq.userId = decodedToken.id;
      next();
    } else {
      res.status(401).json({ error: "invalid token" });
    }
  }
};

// Middleware de autorización por rol
export const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};