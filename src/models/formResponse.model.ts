import { Schema, model } from 'mongoose';

const questionSchema = new Schema({});
const Question = model('Question', questionSchema);
export default Question;
