import express from 'express';
import { errorHandler } from './middleware/error-handler';
import { healthRouter } from './routes/health.routes';

export const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use(errorHandler);

