import { Router } from 'express';
import { currentUser, login, register, updateCurrentUser } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', requireAuth, currentUser);
authRouter.patch('/me', requireAuth, updateCurrentUser);

