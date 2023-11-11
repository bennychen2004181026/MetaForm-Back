import mongoose, { Schema } from 'mongoose';
import { MembershipType, Role, IUser } from '@customizesTypes/users';

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 20,
            index: true,
        },
        firstName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 30
        },
        lastName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 30
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            select: false,
            minlength: 8,
            maxlength: 32,
            validate: {
                validator: (value: string): boolean => {
                    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^_&*]).{8,32}$/;
                    return regex.test(value);
                },
                message: (): string => 'Password should contain at least one number, one lowercase letter, one uppercase letter and one special character (@,#,$,%,^,_,&,*,!).'
            },
        },
        createdForms: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Form',
            },
        ],
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.SuperAdmin,
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
        isAccountComplete: {
            type: Boolean,
            require: true,
            default: false
        },
        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        googleRefreshToken: {
            type: String,
            select: false,
        },
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
        isActive: {
            type: Boolean,
            default: false,
            require: true,
        },
        membershipType: {
            type: String,
            enum: Object.values(MembershipType),
            default: MembershipType.Basic,
            require: true
        },
        currentSubscription: {
            type: Schema.Types.ObjectId,
            ref: 'SubscriptionPlan',
        },
        paymentHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Payment',
            },
        ],
    },
    {
        timestamps: true, // Enables automatic timestamps (createdAt, updatedAt)
    }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
