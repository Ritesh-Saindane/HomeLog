import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { HttpError } from '../utils/http-error';
import { parseBody } from '../utils/validation';
import { maintenanceSchema } from '../validators/maintenance.validators';
import { routeParam } from '../utils/request';

function ownerId(request: Request): string { return (request as AuthenticatedRequest).userId; }
async function ownedAsset(assetId: string, userId: string) {
  const asset = await prisma.asset.findFirst({ where: { id: assetId, userId } });
  if (!asset) throw new HttpError(404, 'Asset not found');
  return asset;
}

export async function listMaintenance(request: Request, response: Response): Promise<void> {
  const assetId = routeParam(request.params.assetId);
  await ownedAsset(assetId, ownerId(request));
  response.json(await prisma.maintenanceSchedule.findMany({ where: { assetId }, orderBy: { nextDueDate: 'asc' } }));
}

export async function createMaintenance(request: Request, response: Response): Promise<void> {
  const assetId = routeParam(request.params.assetId);
  await ownedAsset(assetId, ownerId(request));
  const data = parseBody(maintenanceSchema, request.body);
  response.status(201).json(await prisma.maintenanceSchedule.create({ data: { ...data, assetId } }));
}

export async function updateMaintenance(request: Request, response: Response): Promise<void> {
  const schedule = await prisma.maintenanceSchedule.findFirst({ where: { id: routeParam(request.params.id), asset: { userId: ownerId(request) } } });
  if (!schedule) throw new HttpError(404, 'Maintenance schedule not found');
  response.json(await prisma.maintenanceSchedule.update({ where: { id: schedule.id }, data: parseBody(maintenanceSchema.partial(), request.body) }));
}

