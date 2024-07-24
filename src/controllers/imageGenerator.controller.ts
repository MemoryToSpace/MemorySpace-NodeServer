// src/controllers/imageGenerator.controller.ts
import { Controller, Post, Route, Body, SuccessResponse, Example } from 'tsoa';
import { GenerateImageRequest, GenerateImageRequestSchema } from '../types/imageGenerator.types';
import { generateImageOpenAI } from '../services/imageGenerator.service';
import {
  sendMemoryEmailRequestSchema,
  SendMemoryEmailRequest,
} from '../types/sendMemoryEmail.types';
import { sendMemoryByEmail } from '../services/email.service';
import AppError from '../utils/appError';

@Route('generate-image')
export class OpenAIController extends Controller {
  /**
   * Generate an image based on the provided text prompt using OpenAI
   * @param request The text prompt to be used for image generation
   * @example request { "text": "A cozy cottage in the woods" }
   * @example response { "_id": "60d5f2c2fc13ae1d7c002b1e", "inputText": "A cozy cottage in the woods", "imageUrl": "https://example.com/image.png" }
   */
  @Post('openai')
  @Example<GenerateImageRequest>({ text: 'A cozy cottage in the woods' })
  @SuccessResponse(200)
  public async generateImageOpenAI(
    @Body() request: GenerateImageRequest,
  ): Promise<{ _id: string; inputText: string; imageUrl: string }> {
    GenerateImageRequestSchema.parse(request);
    return generateImageOpenAI(request.text);
  }

  /**
   * Send memory details to the provided email
   * @param request The request containing memory ID and email
   * @example request { "_id": "60d5f2c2fc13ae1d7c002b1e", "email": "example@example.com" }
   */
  @Post('send-memory')
  @SuccessResponse(200)
  public async sendMemoryByEmail(
    @Body() request: SendMemoryEmailRequest,
  ): Promise<{ message: string }> {
    sendMemoryEmailRequestSchema.parse(request);
    try {
      await sendMemoryByEmail(request._id, request.email);
      return { message: 'Email sent successfully' };
    } catch (error: any) {
      throw new AppError(error.message, 500);
    }
  }
}
