import { z } from 'zod';

const optionalDate = z.coerce.date().optional().nullable();

export const assetSchema = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(100),
  brand: z.string().trim().max(100).optional().nullable(),
  modelNumber: z.string().trim().max(100).optional().nullable(),
  serialNumber: z.string().trim().max(100).optional().nullable(),
  purchaseDate: optionalDate,
  purchasePrice: z.coerce.number().nonnegative().optional().nullable(),
  warrantyEndDate: optionalDate,
  location: z.string().trim().max(150).optional().nullable(),
  photoUrl: z.string().max(2000).optional().nullable(),
  status: z.enum(['ACTIVE', 'IN_REPAIR', 'RETIRED', 'SOLD']).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

