import { Router } from 'express';
import { publicAssetByQr } from '../controllers/public.controller';

export const publicRouter = Router();
publicRouter.get('/assets/qr/:qrCodeId', publicAssetByQr);

