import { Schema, Document } from 'mongoose';

interface IFile {
    originalName: string;
    remoteUrl: string;
    name: string;
}
export interface IAnswer extends Document {
    questionId: Schema.Types.ObjectId;
    answerBody: string[];
    files: IFile[];
}
