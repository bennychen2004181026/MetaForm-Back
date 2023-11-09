import { Schema, Document } from 'mongoose';

export interface IFormResponse extends Document {
    formId: string;
    answers: Schema.Types.ObjectId[];
}
