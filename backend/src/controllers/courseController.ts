import express from "express";
import { Request, Response, NextFunction, response } from 'express';
import { CourseModel } from "../models/course"

const router = express.Router();

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await CourseModel.find({});

        response.json(courses);

    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos el id del ramo buscado
        const courseId = req.params.id;
        const course = await CourseModel.findById(courseId);

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ error: "course not found" })
        }

    } catch (error) {
        next(error);
    }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, name, difficulty, required } = req.body;

        const courseI = {
            code: code,
            name: name,
            difficulty: difficulty || 0,
            required: required,
        }

        const course = new CourseModel({ courseI });

        const savedCourse = await course.save();

        res.status(201).json(savedCourse);

    } catch (error) {
        next(error);
    }
};