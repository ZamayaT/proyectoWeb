import bcrypt from "bcrypt";
import { Request, Response, NextFunction, response } from 'express';
import { UserModel } from "../models/user";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find({});

        response.json(users);

    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos el id del usuario buscado
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" })
        }

    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new UserModel({
            username,
            passwordHash,
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);

    } catch (error) {
        next(error);
    }
};
