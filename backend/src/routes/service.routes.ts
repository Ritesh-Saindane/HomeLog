import { Router } from 'express';
import { deleteService, updateService } from '../controllers/service.controller';
import { requireAuth } from '../middleware/auth';

export const serviceRouter = Router();
serviceRouter.use(requireAuth);
serviceRouter.put('/:id', updateService);
serviceRouter.delete('/:id', deleteService);

