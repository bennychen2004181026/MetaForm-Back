import { Schema, model } from 'mongoose';

const { Types } = Schema;
const questionSchema = new Schema({
    formId: { type: Types.ObjectId, required: true },
    questionBody: { type: String, required: true },
    type: { type: String, required: true },
    mandatory: { type: Boolean, required: true },
    options: [String],
    fileStorageUrl: [String],
});
const Question = model('Question', questionSchema);
export default Question;
