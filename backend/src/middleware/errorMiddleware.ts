import logger from "../utils/logger"
import { NextFunction, Response, Request } from "express"

const errorHandler = (
  error: { name: string, message: string },
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error.message)

  logger.error(error.name)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }
  else if (
    error.name === 'MongoServerError'
    && error.message.includes('E11000 duplicate key error')
  ) {
    if (error.message.includes('email')) {
      response
        .status(400)
        .json({ error: 'email address is already in use' })
    }
    else {
      response
        .status(400)
        .json({ error: 'username is already in use' })
    }
  }
  else if (error.name === 'JsonWebTokenError') {
    response.status(401).json({ error: 'invalid token' })
  }
  else if (error.name === 'TokenExpiredError') {
    response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

export default errorHandler
