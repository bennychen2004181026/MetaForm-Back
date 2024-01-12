import { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
    questionId: Schema.Types.ObjectId;
    answerBody: string[];
}
