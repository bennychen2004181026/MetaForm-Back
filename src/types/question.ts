import { Document } from 'mongoose';

enum questionType {
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
    mandatory: boolean;
    options?: [string];
    fileStorageUrl?: [string];
}
