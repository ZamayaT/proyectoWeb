import { CommentModel } from '../../src/models/comment';
import { CourseModel } from '../../src/models/course';
import { UserModel } from '../../src/models/user';

// Datos mock iniciales para cursos
const initialCourses = [
  {
    code: 'CC3001',
    name: 'Algoritmos y Estructuras de Datos',
    difficulty: 6,
    required: true
  },
  {
    code: 'CC3002',
    name: 'Metodologías de Diseño y Programación',
    difficulty: 5,
    required: true
  }
];

// Datos mock iniciales para comentarios
const initialComments = [
  {
    content: 'Excelente ramo, muy bien estructurado',
    votes: 5
  },
  {
    content: 'Bastante difícil pero se aprende mucho',
    votes: 3
  }
];

// Funciones auxiliares para obtener datos de la BD de test
const commentsInDb = async () => {
  const comments = await CommentModel.find({});
  return comments.map(comment => comment.toJSON());
};

const coursesInDb = async () => {
  const courses = await CourseModel.find({});
  return courses.map(course => course.toJSON());
};

const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map(user => user.toJSON());
};

export default {
  initialCourses,
  initialComments,
  commentsInDb,
  coursesInDb,
  usersInDb
};