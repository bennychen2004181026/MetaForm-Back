import { Schema, model } from 'mongoose';
import { IFormResponse } from '../types/formResponse';

const { Types } = Schema;
const formResponse = new Schema({
    formId: { type: Types.ObjectId, required: true },
    answers: [
        {
            type: Types.ObjectId,
            ref: 'Response',
        },
    ],
});
const FormResponse = model<IFormResponse>('Response', formResponse);
export default FormResponse;
