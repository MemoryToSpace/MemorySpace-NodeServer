// src/models/imageGenerator.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IImageGenerator extends Document {
  inputText: string;
  imageUrl: string;
  createdAt: Date;
}

const imageGeneratorSchema: Schema = new Schema({
  inputText: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Memory = mongoose.model<IImageGenerator>('Memory', imageGeneratorSchema);

export default Memory;
