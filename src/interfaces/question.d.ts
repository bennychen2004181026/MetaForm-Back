import { Document } from 'mongoose';

export enum questionType {
    SINGLE_CHOICE,
    MULTIPLE_CHOICE,
    DROPDOWN,
    SHORT_ANSWER,
    OTHERS,
}

export interface IQuestion extends Document {
    formId: string;
    questionBody: string;
    type: questionType;
    required: boolean;
    options?: string[];
    fileStorageUrl?: string[];
    other: boolean;
}
