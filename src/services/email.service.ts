// src/services/email.service.ts
import DataAccess from '../utils/dataAccess';
import { IImageGenerator } from '../models/imageGenerator.model';
import mongoose from 'mongoose';
import sendEmail from '../config/mailersend';

export const sendMemoryByEmail = async (memoryId: string, email: string): Promise<void> => {
  const memory = await DataAccess.findById<IImageGenerator>(
    'Memory',
    new mongoose.Types.ObjectId(memoryId),
  );

  if (!memory) {
    throw new Error(`Memory with ID ${memoryId} not found`);
  }

  const message = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f3f4f6;">
    <h1 style="color: #4CAF50; text-align: center;">Your Memory</h1>
    <p style="font-size: 16px; color: #333;">Here is the memory you requested:</p>
    <div style="margin: 20px 0; padding: 10px; border-radius: 8px; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <p style="font-size: 14px; color: #555;"><strong>Text:</strong></p>
      <p style="font-size: 18px; color: #000; background: #e0f7fa; padding: 10px; border-radius: 5px;">${memory.inputText}</p>
    </div>
    <div style="text-align: center; margin: 20px 0;">
      <img src="${memory.imageUrl}" alt="Memory Image" style="max-width: 100%; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" />
    </div>
    <p style="font-size: 14px; color: #666;">Thank you for using our service!</p>
    <p style="font-size: 14px; color: #666;">Best regards,<br /><strong>The MemorySpace Team</strong></p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://example.com" style="font-size: 14px; color: #fff; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
    </div>
  </div>
`;

  await sendEmail({
    to: email,
    subject: 'Your Requested Memory',
    text: `Here is your requested memory: ${memory.inputText}`,
    html: message,
  });
};
