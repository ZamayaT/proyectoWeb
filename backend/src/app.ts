import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import commentRouter from './routes/commentRoutes';
import courseRouter from './routes/courseRoutes';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorMiddleware';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('dist'));
app.use(cookieParser()); 

// Conectar a MongoDB
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 TEST_MONGODB_URI:', process.env.TEST_MONGODB_URI);
console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI);

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI 
  : process.env.MONGODB_URI;

console.log('🔍 Using MONGODB_URI:', MONGODB_URI);

// ✅ FIX: No usar dbName en test, porque ya está en la URI
const connectOptions = process.env.NODE_ENV === 'test' 
  ? {} 
  : { dbName: process.env.MONGODB_DBNAME };

mongoose.set('strictQuery', false);

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, connectOptions).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
}

// Rutas
app.use('/api/comments', commentRouter);
app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter)

// Middleware de errores
app.use(errorHandler);

export default app;