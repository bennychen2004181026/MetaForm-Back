import { Document } from 'mongoose';

export interface IFormResponse extends Document {
    formId: string;
    answers: string[];
}
