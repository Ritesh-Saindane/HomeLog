import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { assetRouter } from './routes/asset.routes';
import { serviceRouter } from './routes/service.routes';
import { maintenanceRouter } from './routes/maintenance.routes';
import { publicRouter } from './routes/public.routes';
import { adviceRouter } from './routes/advice.routes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/assets', assetRouter);
app.use('/services', serviceRouter);
app.use('/maintenance', maintenanceRouter);
app.use('/public', publicRouter);
app.use('/advice', adviceRouter);
app.use(errorHandler);

