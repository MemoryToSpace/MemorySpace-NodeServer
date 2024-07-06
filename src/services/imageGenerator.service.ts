// src/services/imageGenerator.service.ts
import axios from 'axios';
import { vars } from '../config/vars';
import DataAccess from '../utils/dataAccess';
import { IImageGenerator } from '../models/imageGenerator.model';
import mongoose from 'mongoose';
import sendEmail from '../config/nodeMailer';
import { downloadImage, uploadToFirebase } from '../utils/firebase';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const limewireUrl = 'https://api.limewire.com/api/image/generation';
const openaiUrl = 'https://api.openai.com/v1/images/generations';
const huggingfaceUrl = 'https://StarQuest2-basicapp.hf.space/run/Integrated';
const hfApiToken = vars.huggingFaceApiToken;

const generateImageRequestLimewire = async (prompt: string, aspect_ratio = '1:1'): Promise<any> => {
  // Create the payload
  console.log(hfApiToken);

  const payload = {
    data: [hfApiToken, prompt],
  };

  // Send the POST request to Hugging Face Spaces
  const nlpResponse = await axios.post(huggingfaceUrl, payload);

  if (nlpResponse.status === 200) {
    const betterPrompt = nlpResponse.data.data[0];

    const prePrompt = '';
    const imagePayload = {
      prompt: `${prePrompt} ${betterPrompt}`,
      aspect_ratio: aspect_ratio,
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Version': 'v1',
      Accept: 'application/json',
      Authorization: `Bearer ${vars.limeToken}`,
    };

    const response = await axios.post(limewireUrl, imagePayload, { headers });
    return response.data;
  } else {
    throw new Error(`Hugging Face Spaces error: ${nlpResponse.data}`);
  }
};

export const generateImageLimewire = async (
  text: string,
): Promise<{ input_text: string; image_url: string }> => {
  const refinedPrompt = `Create a detailed and visually stunning image based on the following description: ${text}`;
  const res = await generateImageRequestLimewire(refinedPrompt);
  const imageUrl = res.data[0].asset_url;

  return {
    input_text: text,
    image_url: imageUrl,
  };
};

const generateImageRequestOpenAI = async (prompt: string): Promise<any> => {
  const payload = {
    model: 'dall-e-3',
    prompt: prompt,
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${vars.openAiKey}`,
  };

  const response = await axios.post(openaiUrl, payload, { headers });
  return response.data;
};

export const generateImageOpenAI = async (
  text: string,
): Promise<{ _id: string; inputText: string; imageUrl: string }> => {
  const refinedPrompt = `Translate the following text from Hebrew to English if necessary. Then, create a detailed 3D visualization that captures the key elements and emotions described. The text is: "${text}". Incorporate relevant architectural styles, landscapes, and notable features mentioned.`;
  const res = await generateImageRequestOpenAI(refinedPrompt);
  const imageUrl = res.data[0].url;

  const tempFilePath = path.join(__dirname, '../../temp', `${uuidv4()}.png`);
  await downloadImage(imageUrl, tempFilePath);

  const firebaseUrl = await uploadToFirebase(tempFilePath);

  fs.unlinkSync(tempFilePath);

  const memory = await DataAccess.create<IImageGenerator>('Memory', {
    inputText: text,
    imageUrl: firebaseUrl,
  });

  return {
    _id: (memory._id as mongoose.Types.ObjectId).toString(),
    inputText: memory.inputText,
    imageUrl: memory.imageUrl,
  };
};

export const generateTestImage = async (text: string): Promise<{ input_text: string }> => {
  await DataAccess.create<IImageGenerator>('Memory', {
    inputText: text,
    imageUrl: text + 'uurrll',
  });

  return {
    input_text: text,
  };
};

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
    email,
    subject: 'Your Requested Memory',
    message: '',
    html: message,
  });
};
