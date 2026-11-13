import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error';

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  console.error(error);
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }
  response.status(500).json({ error: 'Internal server error' });
}

