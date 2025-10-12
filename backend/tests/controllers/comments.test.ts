import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app';
import { CommentModel } from '../../src/models/comment';
import { CourseModel } from '../../src/models/course';
import helper from '../helpers/testHelper';

const api = supertest(app);

describe('Comment API tests', () => {
  let testCourseId: string;

  beforeEach(async () => {
    // Limpiar la base de datos
    await CommentModel.deleteMany({});
    await CourseModel.deleteMany({});

    // Crear un curso de prueba
    const course = new CourseModel(helper.initialCourses[0]);
    const savedCourse = await course.save();
    testCourseId = (savedCourse._id as mongoose.Types.ObjectId).toString();

    // Crear comentarios de prueba asociados al curso
    for (const comment of helper.initialComments) {
      const commentObject = new CommentModel({
        ...comment,
        course: testCourseId,
        author: null // Comentario anónimo
      });
      await commentObject.save();
    }
  });

  test('comments are returned as json', async () => {
    await api
      .get(`/api/comments/course/${testCourseId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all comments for a course are returned', async () => {
    const response = await api.get(`/api/comments/course/${testCourseId}`);
    
    assert.strictEqual(response.body.length, helper.initialComments.length);
  });

  test('a valid comment can be added', async () => {
    const newComment = {
      content: 'Este es un comentario de prueba',
      course: testCourseId,
      author: null
    };

    await api
      .post('/api/comments')
      .send(newComment)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const commentsAtEnd = await helper.commentsInDb();
    assert.strictEqual(commentsAtEnd.length, helper.initialComments.length + 1);

    const contents = commentsAtEnd.map(c => c.content);
    assert(contents.includes('Este es un comentario de prueba'));
  });

  test('comment without content is not added', async () => {
    const newComment = {
      course: testCourseId,
      author: null
    };

    await api
      .post('/api/comments')
      .send(newComment)
      .expect(400);

    const commentsAtEnd = await helper.commentsInDb();
    assert.strictEqual(commentsAtEnd.length, helper.initialComments.length);
  });

  test('comment without course is not added', async () => {
    const newComment = {
      content: 'Comentario sin curso',
      author: null
    };

    await api
      .post('/api/comments')
      .send(newComment)
      .expect(400);

    const commentsAtEnd = await helper.commentsInDb();
    assert.strictEqual(commentsAtEnd.length, helper.initialComments.length);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});