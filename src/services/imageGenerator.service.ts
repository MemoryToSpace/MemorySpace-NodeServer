// src/services/imageGenerator.service.ts
import axios from 'axios';
import { vars } from '../config/vars';
import DataAccess from '../utils/dataAccess';
import { IImageGenerator } from '../models/imageGenerator.model';
import mongoose from 'mongoose';
import { uploadBufferToFirebase } from '../utils/firebase';
import { v4 as uuidv4 } from 'uuid';
import { enhancePrompt, translateText } from './nlp.service';

const openaiUrl = 'https://api.openai.com/v1/images/generations';

export const generateImageOpenAI = async (
  text: string,
): Promise<{ _id: string; inputText: string; imageUrl: string }> => {
  let processedText = text;

  if (/[א-ת]/.test(text)) {
    processedText = await translateText(text);
  }

  const improvedText = await enhancePrompt(processedText);

  const refinedPrompt = `Create an image according to: "${improvedText}". The image must be in beautiful black and white, in the style of an architectural drawing, and viewed from a high bird's-eye perspective.`;
  const res = await generateImageRequestOpenAI(refinedPrompt);
  const base64Image = res.data[0].b64_json;

  const buffer = convertBase64ToBuffer(base64Image);
  const firebaseUrl = await uploadImageToFirebase(buffer);

  return createMemoryRecord(text, firebaseUrl);
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
