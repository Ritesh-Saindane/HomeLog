import { Router } from 'express';
import { updateMaintenance } from '../controllers/maintenance.controller';
import { requireAuth } from '../middleware/auth';

export const maintenanceRouter = Router();
maintenanceRouter.use(requireAuth);
maintenanceRouter.put('/:id', updateMaintenance);

