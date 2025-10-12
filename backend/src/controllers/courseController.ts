import { Request, Response, NextFunction } from 'express';
import { CourseModel } from "../models/course";

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await CourseModel.find({});
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: "course not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, name, difficulty, required } = req.body;

    const course = new CourseModel({
      code,
      name,
      difficulty: difficulty || 0,
      required
    });

    const savedCourse = await course.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
};