import { Schema, model } from 'mongoose';
import { ICompany } from '@interfaces/company';

const CompanySchema: Schema = new Schema({
    companyName: {
        type: String,
        required: true,
    },

    abn: {
        type: String,
        required: true,
        unique: true,
    },

    logo: {
        type: String,
    },

    description: {
        type: String,
        required: true,
    },

    industry: {
        type: [String],
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },

    employees: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },

    address: {
        type: String,
    },
});


CompanySchema.pre('save', async (next) => {

    next();
});

const Company = model<ICompany>('Company', CompanySchema);

export default Company;
