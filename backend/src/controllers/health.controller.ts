import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../services/health.service';

export async function getHealth(_request: Request, response: Response): Promise<void> {
  try {
    await checkDatabaseConnection();
    response.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    response.status(503).json({ status: 'degraded', database: 'unavailable' });
  }
}

