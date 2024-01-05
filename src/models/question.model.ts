import { Schema, model } from 'mongoose';

enum questionTypes {
    MULTIPLE_CHOICE = 'Multiple Choice',
    SHORT_ANSWER = 'Short answer',
    PARAGRAPH = 'Paragraph',
    CHECK_BOXES = 'CheckBoxes',
    FILE_UPLOAD = 'File upload',
    DATE = 'Date',
    TIME = 'Time',
}
const questionSchema = new Schema({
    questionTitle: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        enum: questionTypes,
        required: true,
    },
    options: [
        {
            type: String,
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
        enum: [1, 2, 3],
    },
});
const Question = model('Question', questionSchema);
export default Question;
export { questionTypes };
