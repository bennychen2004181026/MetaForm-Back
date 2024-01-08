import { Schema, model } from 'mongoose';

enum questionTypes {
    MULTIPLE_CHOICE = '0',
    SHORT_ANSWER = '1',
    PARAGRAPH = '2',
    CHECK_BOXES = '3',
    FILE_UPLOAD = '4',
    DATE = '5',
    TIME = '6',
}

const questionSchema = new Schema({
    questionTitle: {
        type: {
            content: { type: String, required: true },
            image: { type: { name: { type: String, required: true }, url: { type: String } } },
        },
        required: true,
    },
    questionType: {
        type: String,
        enum: questionTypes,
        required: true,
    },
    options: [
        {
            type: {
                value: { type: String, required: true },
                otherOption: { type: Boolean },
                image: { type: { name: { type: String, required: true }, url: { type: String } } },
            },
        },
    ],
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Answer',
        },
    ],
    required: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    acceptFileTypes: [
        {
            type: String,
            enum: ['Image', 'PDF'],
        },
    ],
    numOfFiles: {
        type: Number,
        enum: ['1', '2', '3'],
    },
});
const Question = model('Question', questionSchema);
export default Question;
export { questionTypes };
