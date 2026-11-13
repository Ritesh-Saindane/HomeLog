import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../middleware/auth';
import { HttpError } from '../utils/http-error';
import { parseBody } from '../utils/validation';
import { loginSchema, registerSchema } from '../validators/auth.validators';

function signToken(userId: string): string {
  return jwt.sign({}, env.jwtSecret, { subject: userId, expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

function publicUser(user: { id: string; name: string; email: string; createdAt: Date; updatedAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

export async function register(request: Request, response: Response): Promise<void> {
  const data = parseBody(registerSchema, request.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) throw new HttpError(409, 'An account with that email already exists');
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({ data: { name: data.name, email: data.email.toLowerCase(), passwordHash } });
  response.status(201).json({ token: signToken(user.id), user: publicUser(user) });
}

export async function login(request: Request, response: Response): Promise<void> {
  const data = parseBody(loginSchema, request.body);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) throw new HttpError(401, 'Invalid email or password');
  response.json({ token: signToken(user.id), user: publicUser(user) });
}

export async function currentUser(request: Request, response: Response): Promise<void> {
  const { userId } = request as AuthenticatedRequest;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, 'User not found');
  response.json({ user: publicUser(user) });
}

export async function updateCurrentUser(request: Request, response: Response): Promise<void> {
  const { userId } = request as AuthenticatedRequest;
  const data = parseBody(z.object({ name: z.string().trim().min(2).max(100) }), request.body);
  const user = await prisma.user.update({ where: { id: userId }, data: { name: data.name } });
  response.json({ user: publicUser(user) });
}

