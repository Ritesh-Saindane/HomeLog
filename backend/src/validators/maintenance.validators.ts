import { z } from 'zod';

export const maintenanceSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().max(4000).optional().nullable(),
  nextDueDate: z.coerce.date(),
  repeatEveryMonths: z.coerce.number().int().positive().optional().nullable(),
  reminderDaysBefore: z.coerce.number().int().min(0).max(365).default(7),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default('09:00'),
  isActive: z.boolean().optional(),
});

