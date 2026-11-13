import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';
import { HttpError } from '../utils/http-error';
import { parseBody } from '../utils/validation';
import { z } from 'zod';

const adviceSchema = z.object({ question: z.string().trim().min(3).max(1200), assetId: z.string().uuid() });

export async function getServiceAdvice(request: Request, response: Response): Promise<void> {
  if (!env.groqApiKey) throw new HttpError(503, 'AI advice is not configured yet. Add GROQ_API_KEY to backend/.env and restart the backend.');
  const { question, assetId } = parseBody(adviceSchema, request.body);
  const userId = (request as AuthenticatedRequest).userId;
  const asset = await prisma.asset.findFirst({ where: { id: assetId, userId }, include: { serviceRecords: { orderBy: { serviceDate: 'desc' }, take: 20 }, maintenanceSchedules: { where: { isActive: true }, orderBy: { nextDueDate: 'asc' } } } });
  if (!asset) throw new HttpError(404, 'Asset not found');
  const history = { asset: asset.name, category: asset.category, brand: asset.brand, model: asset.modelNumber, purchaseDate: asset.purchaseDate, warrantyEndDate: asset.warrantyEndDate, services: asset.serviceRecords, schedules: asset.maintenanceSchedules };
  let result: globalThis.Response;
  try {
    result = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.groqApiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        temperature: 0.3,
        max_completion_tokens: 1600,
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: 'You are HomeLog, a practical maintenance assistant for one specific household appliance. Ground every recommendation in this appliance’s supplied details and service history. Do not use or assume history from other appliances. Mention when history is insufficient. Give safe, concise recommendations and direct electrical, gas, refrigerant, or hazardous repairs to a qualified technician.' },
          { role: 'user', content: `Appliance-specific question: ${question}\n\nSelected appliance and its service history (JSON): ${JSON.stringify(history)}` },
        ],
      }),
    });
  } catch (error) {
    console.error('Groq request failed before receiving a response:', error);
    throw new HttpError(502, 'Could not connect to Groq. Check the backend network connection and try again.');
  }

  const responseBody = await result.json().catch(() => ({})) as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
    error?: { message?: string; type?: string; code?: string };
  };
  if (!result.ok) {
    const groqMessage = responseBody.error?.message || `Groq returned HTTP ${result.status}`;
    console.error(`Groq advice request rejected (${result.status}): ${groqMessage}`);
    if (result.status === 401) throw new HttpError(502, 'Groq rejected the API key. Check GROQ_API_KEY in backend/.env, then restart the backend.');
    if (result.status === 403) throw new HttpError(502, 'This Groq account or API key is not permitted to use the requested model. Check model access in the Groq console.');
    if (result.status === 404) throw new HttpError(502, 'Groq could not find the requested model. Confirm that openai/gpt-oss-120b is available to this account.');
    if (result.status === 429) throw new HttpError(502, 'Groq rate limit or account quota reached. Check usage and limits in the Groq console.');
    throw new HttpError(502, `Groq rejected the advice request: ${groqMessage}`);
  }
  const content = responseBody.choices?.[0]?.message?.content;
  const answer = Array.isArray(content) ? content.map((part) => part.text || '').join('') : content;
  response.json({ answer: answer || 'I could not form a recommendation from that history.' });
}

