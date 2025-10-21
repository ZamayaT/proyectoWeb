import dotenv from 'dotenv';
dotenv.config();

import app from "./app";
import config from './utils/config';
import logger from './utils/logger';


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