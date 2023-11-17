import { Schema, model } from 'mongoose';
import { ICompany } from '@interfaces/companies';

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

    industry: {
        type: String,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: false,
        required: true,
    },

    employees: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
});


CompanySchema.pre('save', async (next) => {

    next();
});

const Company = model<ICompany>('Company', CompanySchema);

export default Company;
