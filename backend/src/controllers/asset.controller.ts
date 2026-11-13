import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { HttpError } from '../utils/http-error';
import { parseBody } from '../utils/validation';
import { assetSchema } from '../validators/asset.validators';
import { routeParam } from '../utils/request';

function userId(request: Request): string { return (request as AuthenticatedRequest).userId; }

export async function listAssets(request: Request, response: Response): Promise<void> {
  response.json(await prisma.asset.findMany({ where: { userId: userId(request) }, orderBy: { createdAt: 'desc' } }));
}

export async function createAsset(request: Request, response: Response): Promise<void> {
  const data = parseBody(assetSchema, request.body);
  const asset = await prisma.asset.create({ data: { ...data, userId: userId(request) } });
  response.status(201).json(asset);
}

export async function getAsset(request: Request, response: Response): Promise<void> {
  const asset = await prisma.asset.findFirst({ where: { id: routeParam(request.params.id), userId: userId(request) }, include: { serviceRecords: { orderBy: { serviceDate: 'desc' } }, maintenanceSchedules: { orderBy: { nextDueDate: 'asc' } } } });
  if (!asset) throw new HttpError(404, 'Asset not found');
  response.json(asset);
}

export async function updateAsset(request: Request, response: Response): Promise<void> {
  const data = parseBody(assetSchema.partial(), request.body);
  const existing = await prisma.asset.findFirst({ where: { id: routeParam(request.params.id), userId: userId(request) } });
  if (!existing) throw new HttpError(404, 'Asset not found');
  response.json(await prisma.asset.update({ where: { id: existing.id }, data }));
}

export async function getAssetByQr(request: Request, response: Response): Promise<void> {
  const asset = await prisma.asset.findFirst({ where: { qrCodeId: routeParam(request.params.qrCodeId), userId: userId(request) }, include: { serviceRecords: { orderBy: { serviceDate: 'desc' } }, maintenanceSchedules: { orderBy: { nextDueDate: 'asc' } } } });
  if (!asset) throw new HttpError(404, 'Asset not found for this QR code');
  response.json(asset);
}

