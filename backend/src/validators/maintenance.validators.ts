import { z } from 'zod';

export const maintenanceSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().max(4000).optional().nullable(),
  nextDueDate: z.coerce.date(),
  repeatEveryMonths: z.coerce.number().int().positive().optional().nullable(),
  reminderDaysBefore: z.coerce.number().int().min(0).max(365).default(7),
  isActive: z.boolean().optional(),
});

