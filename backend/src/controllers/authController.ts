import { Request, Response, NextFunction } from 'express';
import {UserModel} from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../utils/config';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    const passwordCorrect = await bcrypt.compare(password, user.password);
    
    if (!passwordCorrect) {
      res.status(401).json({error: "invalid username or password",});
    } else {
      const userForToken = {
        username: user.username,
        csrf: crypto.randomUUID(),
        id: user._id,
      };

      const token = jwt.sign(userForToken, config.JWT_SECRET, { expiresIn: 60 * 60 });
      res.setHeader("X-CSRF-Token", userForToken.csrf);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).send({ id: user.id, username: user.username, role : user.role});
    }
  } else {
    res.status(401).json({error: "invalid username or password"});
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const user = await UserModel.findById(req.userId).select('-password');
  res.status(200).json(user);
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send({
    message: "Logged out successfully"
  });
};

