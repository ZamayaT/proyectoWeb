import app from './app';
import dotenv from 'dotenv';
import config from './utils/config';
import logger from './utils/logger';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});