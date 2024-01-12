import { Schema, model } from 'mongoose';
import { IForm } from '@interfaces/form';

const { Types } = Schema;
const formSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            ref: 'User',
            required: true,
        },
        questions: [
            {
                type: Types.ObjectId,
                ref: 'Question',
            },
        ],
        responses: [
            {
                type: Types.ObjectId,
                ref: 'Response',
            },
        ],
        description: {
            type: String,
        },
    },
    { timestamps: true },
);
const Form = model<IForm>('Form', formSchema);
export default Form;
