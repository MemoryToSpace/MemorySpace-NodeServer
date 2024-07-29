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
  <div style="font-family: Arial, sans-serif; max-width: 80vw; margin: 0 auto; padding: 20px; background-color: #FFFFFF; overflow: hidden;">
    <h1 style="color: #0000FF; text-align: center;">Here is the memory you requested with the image we created for you</h1>
    <div style="border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; padding: 20px;">
      <h2 style="color: #0000FF; text-align: center; font-weight: normal;">FROM <strong>MEMORY</strong> TO <strong>SPACE</strong> THROUGH <strong>AI</strong></h2>
      <h3 style="color: #0000FF; text-align: center; font-weight: normal;">LIFE THROUGH <strong>ALGORITHM</strong></h3>
      <h4 style="color: #0000FF; text-align: center; font-weight: normal;">Noa Peretz | BEZALEL Architecture</h4>
      <div style="margin: 20px 0; padding: 20px; border-radius: 8px; background-color: #FCF6EA; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h4 style="font-size: 16px; font-weight: bold; color: #0000FF;">Your Memory:</h4>
        <p style="font-size: 14px; color: #0000FF;">${memory.inputText}</p>
      </div>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${memory.imageUrl}" alt="Memory Image" style="max-width: 100%; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" />
      </div>
      <p style="font-size: 16px; color: #0000FF; text-align: center;">Thanks for being a part of my project</p>
      <p style="font-size: 16px; color: #0000FF; text-align: center;"><strong>Noa Peretz</strong></p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://memory-to-space.netlify.app/" style="font-size: 14px; color: #fff; background-color: #F8A679; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
      </div>
      <p style="font-size: 14px; color: #0000FF; text-align: center;">
        I'd love to hear about your experience with the project and answer any questions you might have.<br>
        Feel free to contact me via <a href="https://www.linkedin.com/in/noa-peretz-26b348280/" style="color: #0000FF;">LinkedIn</a> or <a href="https://www.instagram.com/peretznoa/" style="color: #0000FF;">Instagram</a>.
      </p>
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
