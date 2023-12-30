import { Schema, Document } from 'mongoose';

export interface IForm extends Document {
    title: string;
    userId: Schema.Types.ObjectId;
    validFrom: Date;
    expire: Date;
    questions: string[];
    responses: Schema.Types.ObjectId[];
    description?: string;
}
