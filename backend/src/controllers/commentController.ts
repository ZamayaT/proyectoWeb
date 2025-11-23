import express from "express";
import { Request, Response, NextFunction } from 'express';
import { CommentModel } from "../models/comment";
import { CourseModel } from "../models/course";

export const getCommentsByCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const comments = await CommentModel.find({ course: courseId }).populate('author', {username:1})

        res.json(comments);

    } catch (error) {
        next(error);
    }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { author, course, content, votes, isAnonimo } = req.body;

        const comment = new CommentModel({
            author : author,
            course : course,
            content : content,
            votes : votes,
            isAnonimo : isAnonimo,
        });

        const savedComment = await comment.save();

        // ACTUALIZAR el curso: incrementar totalComments y recalcular difficulty
        const allComments = await CommentModel.find({ course: course });
        const newDifficulty = allComments.reduce((sum, c) => sum + c.votes, 0) / allComments.length;
        
        await CourseModel.findByIdAndUpdate(course, {
            totalComments: allComments.length,
            difficulty: newDifficulty
        });

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

        // CRÍTICO: Actualizar el curso después de eliminar
        const remainingComments = await CommentModel.find({ course: deletedComment.course });
        
        // Recalcular difficulty (promedio de votes) o 0 si no hay comentarios
        const newDifficulty = remainingComments.length > 0
            ? remainingComments.reduce((sum, c) => sum + c.votes, 0) / remainingComments.length
            : 0;  // ← IMPORTANTE: Si no hay comentarios, difficulty = 0

        await CourseModel.findByIdAndUpdate(deletedComment.course, {
            totalComments: remainingComments.length,
            difficulty: newDifficulty
        });

        await deletedComment.populate("course");

        res.status(201).json(deletedComment);
    } catch (error) {
        next(error);
    }
}