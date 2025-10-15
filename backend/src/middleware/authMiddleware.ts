import { Request, Response, NextFunction } from 'express';
import config from '../utils/config';
import jwt from "jsonwebtoken"

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
