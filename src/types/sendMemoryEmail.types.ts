// src/types/sendMemoryEmail.types.ts
import { z } from 'zod';

export const sendMemoryEmailRequestSchema = z.object({
  _id: z.string().min(1, 'Memory ID is required'),
  email: z.string().email('Invalid email address'),
});

export interface SendMemoryEmailRequest {
  _id: string;
  email: string;
}
