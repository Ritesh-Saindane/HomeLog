import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { HttpError } from '../utils/http-error';
import { routeParam } from '../utils/request';

export async function publicAssetByQr(request: Request, response: Response): Promise<void> {
  const asset = await prisma.asset.findUnique({
    where: { qrCodeId: routeParam(request.params.qrCodeId) },
    select: {
      id: true,
      name: true,
      category: true,
      brand: true,
      modelNumber: true,
      location: true,
      status: true,
      photoUrl: true,
      serviceRecords: {
        orderBy: { serviceDate: 'desc' },
        take: 5,
        select: {
          serviceDate: true,
          serviceType: true,
          title: true,
          description: true,
          serviceProvider: true,
          replacedComponents: true,
        },
      },
    },
  });
  if (!asset) throw new HttpError(404, 'Public asset not found');
  response.json({ ...asset, readOnly: true });
}

