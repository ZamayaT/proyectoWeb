import express from "express";
import { Request, Response, NextFunction, response } from 'express';
import { CommentModel } from "../models/comment"

const router = express.Router();


export const getCommentsByCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos el id del ramo asociado a los comentarios buscados
        const courseId = req.params.id;
        const comments = await CommentModel.find({ course: courseId }).populate('author', {username:1})

        res.json(comments);

    } catch (error) {
        next(error);
    }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, course, content, votes } = req.body;

        // Si se quiere mantener el author anónimo, se puede mandar como nulo
        const comment = new CommentModel({
            author : author,
            course : course,
            content : content,
            votes : votes
        });

        const savedComment = await comment.save();

        await savedComment.populate("author", {username:1});
        await savedComment.populate("course");

        res.status(201).json(savedComment);
        
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }

}