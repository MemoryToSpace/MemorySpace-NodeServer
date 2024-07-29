// src/config/connectDb.ts

import mongoose from 'mongoose';
import { vars } from '../config/vars';
const { databaseURL } = vars;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(databaseURL);
    console.log('DB connection successful!');
  } catch (err) {
    console.error('DB connection failed.', err);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('DB connection closed.');
  } catch (err) {
    console.error('Error closing DB connection.', err);
  }
};
