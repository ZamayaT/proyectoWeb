import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import commentRouter from './routes/commentRoutes';
import courseRouter from './routes/courseRoutes';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import cookieParser from 'cookie-parser';
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
app.use('/api/auth', authRouter);

// Endpoint de testing (solo en modo test)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = express.Router();
  
  testingRouter.post('/reset', async (req, res) => {
    console.log('🧹 Limpiando base de datos para tests...');
    
    try {
      // Importar modelos dinámicamente
      const { CommentModel } = await import('./models/comment');
      const { UserModel } = await import('./models/user');
      const { CourseModel } = await import('./models/course');
      
      // Eliminar todos los documentos
      await CommentModel.deleteMany({});
      await UserModel.deleteMany({});
      
      console.log('✅ Base de datos limpiada correctamente');
      res.status(204).end();
    } catch (error) {
      console.error('❌ Error al limpiar la base de datos:', error);
      res.status(500).json({ error: 'Error al resetear la base de datos' });
    }
  });
  
  app.use('/api/testing', testingRouter);
  console.log('🧪 Rutas de testing habilitadas en /api/testing');
}

// Middleware de errores (SIEMPRE AL FINAL)
app.use(errorHandler);

export default app;