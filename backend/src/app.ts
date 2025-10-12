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

// Middleware de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error);
  
  // Manejo de errores de validación de Mongoose
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  
  // Manejo de errores de cast (IDs inválidos)
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

export default app;