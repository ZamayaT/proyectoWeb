import express from "express";
import { Request, Response, NextFunction, response } from 'express';
import { CommentModel } from "../models/comment"

const router = express.Router();


export const getCommentsByCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos el id del ramo asociado a los comentarios buscados
        const courseId = req.params.id;
        const comments = await CommentModel.find({ course: courseId });

        res.json(comments);

    } catch (error) {
        next(error);
    }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { author, course, content } = req.body;

        // Si se quiere mantener el author anónimo, se puede mandar como nulo
        const comment = new CommentModel({
            author,
            course,
            content,
        });

        const savedComment = await comment.save();

        res.status(201).json(savedComment);
        
    } catch (error) {
        next(error);
    }
};