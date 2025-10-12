import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app';
import { CourseModel } from '../../src/models/course';
import helper from '../helpers/testHelper';

const api = supertest(app);

describe('Course API tests', () => {
  beforeEach(async () => {
    // Limpiar la base de datos
    await CourseModel.deleteMany({});

    // Insertar cursos de prueba
    for (const course of helper.initialCourses) {
      const courseObject = new CourseModel(course);
      await courseObject.save();
    }
  });

  test('courses are returned as json', async () => {
    await api
      .get('/api/courses')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all courses are returned', async () => {
    const response = await api.get('/api/courses');
    
    assert.strictEqual(response.body.length, helper.initialCourses.length);
  });

  test('a specific course is within the returned courses', async () => {
    const response = await api.get('/api/courses');
    
    const codes = response.body.map((c: any) => c.code);
    assert(codes.includes('CC3001'));
  });

  test('a valid course can be added', async () => {
    const newCourse = {
      code: 'CC3501',
      name: 'Modelación y Computación Gráfica para Ingenieros',
      difficulty: 7,
      required: false
    };

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const coursesAtEnd = await helper.coursesInDb();
    assert.strictEqual(coursesAtEnd.length, helper.initialCourses.length + 1);

    const codes = coursesAtEnd.map(c => c.code);
    assert(codes.includes('CC3501'));
  });

  test('course without code is not added', async () => {
    const newCourse = {
      name: 'Curso sin código',
      difficulty: 5,
      required: true
    };

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(400);

    const coursesAtEnd = await helper.coursesInDb();
    assert.strictEqual(coursesAtEnd.length, helper.initialCourses.length);
  });

  test('a specific course can be viewed', async () => {
    const coursesAtStart = await helper.coursesInDb();
    const courseToView = coursesAtStart[0];

    const resultCourse = await api
      .get(`/api/courses/${courseToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(resultCourse.body.code, courseToView.code);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});