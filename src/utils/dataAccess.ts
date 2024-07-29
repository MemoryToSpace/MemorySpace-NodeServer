// src/utils/dataAccess.ts

import mongoose, { ClientSession, Document, Model, QueryOptions } from 'mongoose';

import AppError from './appError';

class DataAccess {
  private static instance: DataAccess;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): DataAccess {
    if (!DataAccess.instance) {
      DataAccess.instance = new DataAccess();
    }
    return DataAccess.instance;
  }

  public getModel<T extends Document>(modelName: string): Model<T> {
    return mongoose.model<T>(modelName);
  }

  public async saveDocument<T extends Document>(document: T, options = {}): Promise<T> {
    if (!document || typeof document.save !== 'function') {
      throw new AppError('Invalid document or document does not have a save method', 400);
    }

    try {
      const savedDocument = await document.save(options);
      return savedDocument;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError(`Failed to save the document. Error: ${errorMessage}`, 500);
    }
  }

  public async create<T extends Document>(modelName: string, data: Partial<T>): Promise<T> {
    const Model = this.getModel<T>(modelName);
    const document = await Model.create(data);
    return document;
  }

  public async deleteById(modelName: string, id: string): Promise<void> {
    const Model = this.getModel<Document>(modelName);
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      throw new AppError(`No document of ${modelName} found with that ID`, 404);
    }
  }

  public async exists<T extends Document>(modelName: string, conditions: any): Promise<boolean> {
    const Model = this.getModel<T>(modelName);
    const result = await Model.exists(conditions);
    return Boolean(result);
  }

  public async findById<T extends Document>(
    modelName: string,
    id: mongoose.Types.ObjectId,
    populateOptions?: string | string[] | mongoose.PopulateOptions | mongoose.PopulateOptions[],
  ): Promise<T | null> {
    const Model = this.getModel<T>(modelName);
    let query: any = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query.exec();
    if (!document) {
      throw new AppError(`No document of ${modelName} found with that ID`, 404);
    }
    return document;
  }

  public async findOneByConditions<T extends Document>(
    modelName: string,
    conditions: any,
    projection: any = {},
    options: any = {},
  ): Promise<T | null> {
    const Model = this.getModel<T>(modelName);
    const query = Model.findOne(conditions, projection, options);
    if (options.lean) {
      query.lean();
    }
    const document = await query.exec();
    return document as T | null;
  }

  public async findByConditions<T extends Document>(
    modelName: string,
    conditions: any = {},
    projection: any = {},
    options: any = {},
  ): Promise<T[]> {
    const Model = this.getModel<T>(modelName);
    const documents = await Model.find(conditions, projection, options).exec();
    return documents as T[];
  }

  public async updateById<T extends Document>(
    modelName: string,
    id: mongoose.Types.ObjectId,
    updateData: any,
    options: mongoose.QueryOptions = { new: true, runValidators: true, session: undefined },
  ): Promise<T | null> {
    const Model = this.getModel<T>(modelName);
    const document = await Model.findByIdAndUpdate(id, updateData, options);
    if (!document) {
      throw new AppError(`No document of ${modelName} found with that ID`, 404);
    }
    return document;
  }

  public async updateOne<T extends Document>(
    modelName: string,
    filter: any,
    updateData: any,
    options: mongoose.QueryOptions = { new: true, runValidators: true },
  ): Promise<T | null> {
    const Model = this.getModel<T>(modelName);
    const updatedDocument = await Model.findOneAndUpdate(filter, updateData, options);
    if (!updatedDocument) {
      throw new AppError('No document found with the provided filter', 404);
    }
    return updatedDocument;
  }

  public async updateMany(
    modelName: string,
    filter: any,
    updateData: any,
    options: QueryOptions & { session?: ClientSession; readPreference?: any } = {},
  ): Promise<any> {
    const Model = this.getModel<Document>(modelName);
    const result = await Model.updateMany(filter, updateData, options);
    return result;
  }
}

// Export a singleton instance of DataAccess
export default DataAccess.getInstance();
