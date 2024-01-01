import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['singleChoice', 'multipleChoice', 'dropDown'],
        required: true,
    },
    options: [
        {
            type: String,
            required: true,
        },
    ],
    expectedAnswerType: {
        type: String,
        enum: ['number', 'string', 'array'],
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Answer',
        },
    ],
    mandatory: {
        type: Boolean,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
});
const Question = model('Question', questionSchema);
export default Question;
