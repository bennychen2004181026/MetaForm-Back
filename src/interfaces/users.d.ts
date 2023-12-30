import type { Document, ObjectId } from 'mongoose';
import { Role, MembershipType } from '@interfaces/userEnum';

export interface IUser extends Document {
    username: string;
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
    createdForms?: ObjectId[];
    role: Role;
    company?: ObjectId;
    isAccountComplete: boolean;
    invitedBy?: ObjectId;
    googleRefreshToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    isActive: boolean;
    membershipType: MembershipType;
    currentSubscription?: ObjectId;
    paymentHistory?: ObjectId[];
}

export type PassportUser = {
    _id?: string;
};
