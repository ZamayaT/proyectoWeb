import bcrypt from "bcrypt";
import { Request, Response, NextFunction, response } from 'express';
import { AdminModel } from "../models/admin";

export const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await AdminModel.find({});

        response.json(admins);

    } catch (error) {
        next(error);
    }
};

export const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos el id del usuario buscado
        const adminId = req.params.id;
        const admin = await AdminModel.findById(adminId);

        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ error: "Admin not found" })
        }

    } catch (error) {
        next(error);
    }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const admin = new AdminModel({
            username,
            passwordHash,
        });

        const savedAdmin = await admin.save();

        res.status(201).json(savedAdmin);

    } catch (error) {
        next(error);
    }
};
