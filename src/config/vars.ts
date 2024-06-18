// config/vars.ts

import dotenv from 'dotenv';
import { defaults } from './default';

dotenv.config();

if (!process.env.DATABASE) {
  throw new Error('DATABASE environment variable is not defined.');
}

const databaseURL = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '');

export const vars = {
  nodeEnv: process.env.NODE_ENV || defaults.nodeEnv,
  port: process.env.PORT || defaults.port,
  limeToken: process.env.LIME_TOKEN || '',
  openAiKey: process.env.OPENAI_KEY || '',
  databaseURL: databaseURL,
  emailUsername: process.env.EMAIL_USERNAME || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : defaults.emailPort,
};
