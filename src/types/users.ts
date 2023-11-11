import type { Document, ObjectId } from "mongoose";

export enum MembershipType {
  Basic = "Basic",
  Premium = "Premium",
}

export enum Role {
  SuperAdmin = "super_admin",
  Admin = "admin",
  Employee = "employee",
}

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  createdForms?: ObjectId[];
  role: string;
  company?: ObjectId;
  isAccountComplete: boolean;
  invitedBy?: ObjectId;
  googleRefreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
  membershipType: string;
  currentSubscription?: ObjectId;
  paymentHistory?: ObjectId[];
}
