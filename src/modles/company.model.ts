import { Schema, model } from 'mongoose';

const companySchema = new Schema({});
const Company = model('Company', companySchema);
export default Company;
