import { Schema, model } from 'mongoose';

const staffSchema = new Schema({});
const Staff = model('Staff', staffSchema);
export default Staff;
