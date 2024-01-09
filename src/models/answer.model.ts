import { Schema, model } from 'mongoose';
import { IAnswer } from '@interfaces/answer';

const { Types } = Schema;
const questionAnswer = new Schema({
    questionId: { type: Types.ObjectId, required: true },
    answerBody: [{ type: String, required: true }],
});
const Answer = model<IAnswer>('Answer', questionAnswer);
export default Answer;
