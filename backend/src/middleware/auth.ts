import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/http-error';

export type AuthenticatedRequest = Request & { userId: string };

export function requireAuth(request: Request, _response: Response, next: NextFunction): void {
  const header = request.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next(new HttpError(401, 'Authentication required'));
  try {
    const payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    if (typeof payload.sub !== 'string') throw new Error('Invalid subject');
    (request as AuthenticatedRequest).userId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

