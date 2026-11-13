import { Router } from 'express';
import { getServiceAdvice } from '../controllers/advice.controller';
import { requireAuth } from '../middleware/auth';

export const adviceRouter = Router();
adviceRouter.post('/', requireAuth, getServiceAdvice);

