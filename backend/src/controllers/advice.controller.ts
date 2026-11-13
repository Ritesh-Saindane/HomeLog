import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';
import { HttpError } from '../utils/http-error';
import { parseBody } from '../utils/validation';
import { z } from 'zod';

const adviceSchema = z.object({ question: z.string().trim().min(3).max(1200) });

export async function getServiceAdvice(request: Request, response: Response): Promise<void> {
  if (!env.groqApiKey) throw new HttpError(503, 'AI advice is not configured yet. Add GROQ_API_KEY to backend/.env and restart the backend.');
  const { question } = parseBody(adviceSchema, request.body);
  const userId = (request as AuthenticatedRequest).userId;
  const assets = await prisma.asset.findMany({ where: { userId }, include: { serviceRecords: { orderBy: { serviceDate: 'desc' }, take: 8 }, maintenanceSchedules: { where: { isActive: true }, orderBy: { nextDueDate: 'asc' } } } });
  const history = assets.map((asset) => ({ asset: asset.name, category: asset.category, brand: asset.brand, model: asset.modelNumber, warrantyEndDate: asset.warrantyEndDate, services: asset.serviceRecords, schedules: asset.maintenanceSchedules }));
  const result = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.groqApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', temperature: 0.3, messages: [{ role: 'system', content: 'You are HomeLog, a practical household appliance maintenance helper. Use the supplied service history. Be clear when information is uncertain. Give safe, concise recommendations and recommend a qualified technician for electrical, gas, refrigerant, or hazardous repairs. Do not claim to diagnose definitively.' }, { role: 'user', content: `Question: ${question}\n\nHousehold asset history (JSON): ${JSON.stringify(history)}` }] }),
  });
  if (!result.ok) throw new HttpError(502, 'AI advice service could not respond. Please try again later.');
  const data = await result.json() as { choices?: Array<{ message?: { content?: string } }> };
  response.json({ answer: data.choices?.[0]?.message?.content ?? 'I could not form a recommendation from that history.' });
}

