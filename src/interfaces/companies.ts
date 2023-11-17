import type { Document, ObjectId } from "mongoose";

export interface ICompany extends Document {
  companyName: string;
  abn: string;
  logo?: string;
  industry: string;
  isActive: boolean;
  employees?: ObjectId[];
}