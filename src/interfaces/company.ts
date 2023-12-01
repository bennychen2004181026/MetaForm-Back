import { ObjectId, Document } from 'mongoose';

export interface ICompany extends Document {
    companyName: string;
    abn: string;
    logo?: string;
    description: string;
    industry: string[];
    isActive: boolean;
    employees?: ObjectId[];
    address?: string;
}