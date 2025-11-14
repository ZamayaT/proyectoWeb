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

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { code, name, difficulty, required } = req.body;

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      id,
      {
        code,
        name,
        required
      },
      { new: true } 
    );

    if (!updatedCourse) return res.status(404).json({ message: "Curso no encontrado" });

    res.json(updatedCourse);

  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await CourseModel.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};


// Funciones para buscar cursos según filtros
export const getElectives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await CourseModel.find({ required: false });

    if (courses && courses.length > 0) {
      res.json(courses);
    } else {
      res.json([]);
    }
  } catch (error) {
    next(error);
  }
};

export const getRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await CourseModel.find({ required: true });

    if (courses && courses.length > 0) {
      res.json(courses);
    } else {
      res.json([]);
    }
  } catch (error) {
    next(error);
  }
};