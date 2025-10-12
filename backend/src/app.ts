import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import commentRouter from './routes/commentRoutes';
import courseRouter from './routes/courseRoutes';
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('dist'));

// Conectar a MongoDB
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI 
  : process.env.MONGODB_URI;

const dbName = process.env.MONGODB_DBNAME;

mongoose.set('strictQuery', false);

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { dbName }).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
}

// Rutas
app.use('/api/comments', commentRouter);
app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);

// Middleware de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;