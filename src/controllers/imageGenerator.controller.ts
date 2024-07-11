// src/controllers/imageGenerator.controller.ts
import { Controller, Post, Route, Body, SuccessResponse, Example } from 'tsoa';
import { GenerateImageRequest, GenerateImageRequestSchema } from '../types/imageGenerator.types';
import {
  generateImageLimewire,
  generateImageOpenAI,
  generateTestImage,
} from '../services/imageGenerator.service';
import {
  sendMemoryEmailRequestSchema,
  SendMemoryEmailRequest,
} from '../types/sendMemoryEmail.types';
import { sendMemoryByEmail } from '../services/email.service';

@Route('generate-image')
export class OpenAIController extends Controller {
  /**
   * Generate an image based on the provided text prompt
   * @param request The text prompt to be used for image generation
   * @example request { "text": "A beautiful sunset over the mountains" }
   * @example response { "input_text": "A beautiful sunset over the mountains", "image_url": "https://example.com/image.png" }
   */
  @Post('limewire')
  @Example<GenerateImageRequest>({ text: 'A beautiful sunset over the mountains' })
  @SuccessResponse(200)
  public async generateImageLimewire(
    @Body() request: GenerateImageRequest,
  ): Promise<{ input_text: string; image_url: string }> {
    GenerateImageRequestSchema.parse(request);
    return generateImageLimewire(request.text);
  }

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
   * Generate atest to check if the server is working
   * @param request The text prompt to be used for image generation
   * @example request { "text": "A cozy cottage in the woods" }
   * @example response { "input_text": "A cozy cottage in the woods" }
   */
  @Post('test')
  @Example<GenerateImageRequest>({ text: 'A cozy cottage in the woods' })
  @SuccessResponse(200)
  public async generateTest(
    @Body() request: GenerateImageRequest,
  ): Promise<{ input_text: string }> {
    GenerateImageRequestSchema.parse(request);
    return generateTestImage('SERVER IS WORKING: ' + request.text);
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
    await sendMemoryByEmail(request._id, request.email);
    return { message: 'Email sent successfully' };
  }
}
