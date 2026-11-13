import { Router } from 'express';
import { createAsset, getAsset, getAssetByQr, listAssets, updateAsset } from '../controllers/asset.controller';
import { createMaintenance, listMaintenance } from '../controllers/maintenance.controller';
import { createService, listServices } from '../controllers/service.controller';
import { requireAuth } from '../middleware/auth';

export const assetRouter = Router();
assetRouter.use(requireAuth);
assetRouter.get('/', listAssets);
assetRouter.post('/', createAsset);
assetRouter.get('/qr/:qrCodeId', getAssetByQr);
assetRouter.get('/:id', getAsset);
assetRouter.put('/:id', updateAsset);
assetRouter.get('/:assetId/services', listServices);
assetRouter.post('/:assetId/services', createService);
assetRouter.get('/:assetId/maintenance', listMaintenance);
assetRouter.post('/:assetId/maintenance', createMaintenance);

