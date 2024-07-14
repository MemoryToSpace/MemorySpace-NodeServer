// src/services/imageGenerator.service.ts
import axios from 'axios';
import { vars } from '../config/vars';
import DataAccess from '../utils/dataAccess';
import { IImageGenerator } from '../models/imageGenerator.model';
import mongoose from 'mongoose';
import { uploadBufferToFirebase } from '../utils/firebase';
import { v4 as uuidv4 } from 'uuid';
import { enhancePrompt, translateText } from './text.service';

const limewireUrl = 'https://api.limewire.com/api/image/generation';
const openaiUrl = 'https://api.openai.com/v1/images/generations';

const generateImageRequestLimewire = async (prompt: string, aspect_ratio = '1:1'): Promise<any> => {
  const prePrompt = '';
  const payload = {
    prompt: `${prePrompt} ${prompt}`,
    aspect_ratio: aspect_ratio,
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Version': 'v1',
    Accept: 'application/json',
    Authorization: `Bearer ${vars.limeToken}`,
  };

  const response = await axios.post(limewireUrl, payload, { headers });
  return response.data;
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
    size: '1792x1024',
    quality: 'standard',
    n: 1,
    response_format: 'b64_json',
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${vars.openAiKey}`,
  };

  const response = await axios.post(openaiUrl, payload, { headers });
  return response.data;
};

const convertBase64ToBuffer = (base64: string): Buffer => {
  return Buffer.from(base64, 'base64');
};

const uploadImageToFirebase = async (buffer: Buffer): Promise<string> => {
  const fileName = `${uuidv4()}.png`;
  return uploadBufferToFirebase(buffer, fileName);
};

const createMemoryRecord = async (
  text: string,
  imageUrl: string,
): Promise<{ _id: string; inputText: string; imageUrl: string }> => {
  const memory = await DataAccess.create<IImageGenerator>('Memory', {
    inputText: text,
    imageUrl: imageUrl,
  });

  return {
    _id: (memory._id as mongoose.Types.ObjectId).toString(),
    inputText: memory.inputText,
    imageUrl: memory.imageUrl,
  };
};

const isHebrew = (text: string): boolean => /[א-ת]/.test(text);

export const generateImageOpenAI = async (
  text: string,
): Promise<{ _id: string; inputText: string; imageUrl: string }> => {
  let processedText = text;

  if (isHebrew(text)) {
    processedText = await translateText(text);
  }

  const improvedText = await enhancePrompt(processedText);

  const refinedPrompt = `Create a Image acording to -->: "${improvedText}".`;
  const res = await generateImageRequestOpenAI(refinedPrompt);
  const base64Image = res.data[0].b64_json;

  const buffer = convertBase64ToBuffer(base64Image);
  const firebaseUrl = await uploadImageToFirebase(buffer);

  return createMemoryRecord(text, firebaseUrl);
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
