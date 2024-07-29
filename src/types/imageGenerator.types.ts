// src/types/imageGenerator.types.ts
import { z } from 'zod';

export const GenerateImageRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
});

export interface GenerateImageRequest {
  text: string;
}
