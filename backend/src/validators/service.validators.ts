import { z } from 'zod';

export const serviceRecordSchema = z.object({
  serviceDate: z.coerce.date(),
  serviceType: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(150),
  description: z.string().max(4000).optional().nullable(),
  technicianName: z.string().trim().max(150).optional().nullable(),
  serviceProvider: z.string().trim().max(150).optional().nullable(),
  cost: z.coerce.number().nonnegative().optional().nullable(),
  invoiceUrl: z.string().url().optional().nullable(),
  replacedComponents: z.string().max(4000).optional().nullable(),
});

