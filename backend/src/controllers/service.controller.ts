import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { HttpError } from '../utils/http-error';
import { parseBody } from '../utils/validation';
import { serviceRecordSchema } from '../validators/service.validators';
import { routeParam } from '../utils/request';

function ownerId(request: Request): string { return (request as AuthenticatedRequest).userId; }
async function ownedAsset(assetId: string, userId: string) {
  const asset = await prisma.asset.findFirst({ where: { id: assetId, userId } });
  if (!asset) throw new HttpError(404, 'Asset not found');
  return asset;
}

export async function listServices(request: Request, response: Response): Promise<void> {
  const assetId = routeParam(request.params.assetId);
  await ownedAsset(assetId, ownerId(request));
  response.json(await prisma.serviceRecord.findMany({ where: { assetId }, orderBy: { serviceDate: 'desc' } }));
}

export async function createService(request: Request, response: Response): Promise<void> {
  const assetId = routeParam(request.params.assetId);
  await ownedAsset(assetId, ownerId(request));
  const data = parseBody(serviceRecordSchema, request.body);
  response.status(201).json(await prisma.serviceRecord.create({ data: { ...data, assetId } }));
}

export async function updateService(request: Request, response: Response): Promise<void> {
  const record = await prisma.serviceRecord.findFirst({ where: { id: routeParam(request.params.id), asset: { userId: ownerId(request) } } });
  if (!record) throw new HttpError(404, 'Service record not found');
  response.json(await prisma.serviceRecord.update({ where: { id: record.id }, data: parseBody(serviceRecordSchema.partial(), request.body) }));
}

export async function deleteService(request: Request, response: Response): Promise<void> {
  const record = await prisma.serviceRecord.findFirst({ where: { id: routeParam(request.params.id), asset: { userId: ownerId(request) } } });
  if (!record) throw new HttpError(404, 'Service record not found');
  await prisma.serviceRecord.delete({ where: { id: record.id } });
  response.status(204).send();
}

