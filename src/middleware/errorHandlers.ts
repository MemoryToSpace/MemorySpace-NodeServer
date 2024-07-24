import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import { vars } from '../config/vars';

export const notFoundHandler = (next: NextFunction): void => {
  const error = new AppError('Not Found', 404);
  next(error);
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
  });

  if (vars.nodeEnv === 'development') {
    console.error('Error:', err);
  } else {
    console.error('Error:', message);
  }
};
