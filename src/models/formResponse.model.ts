import { Schema, model } from 'mongoose';

const formResponse = new Schema({});
const FormResponse = model('FormResponse', formResponse);
export default FormResponse;
