// src/utils/firebase.ts
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bucket from '../config/firebaseAdmin';

export const downloadImage = async (url: string, filePath: string): Promise<void> => {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const uploadToFirebase = async (filePath: string): Promise<string> => {
  const fileName = `${uuidv4()}-${path.basename(filePath)}`;
  await bucket.upload(filePath, {
    destination: fileName,
    public: true,
  });
  const file = bucket.file(fileName);
  return file.publicUrl();
};
