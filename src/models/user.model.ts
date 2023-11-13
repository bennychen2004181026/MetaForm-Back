import bcrypt from 'bcrypt';
import mongoose, { CallbackWithoutResultAndOptionalError, Schema } from 'mongoose';
import { MembershipType, Role, IUser } from '@customizesTypes/users';
import Errors from '@errors/ClassError'

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 20,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
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

UserSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.password) {
        return next();
    }

    if (this.isModified('password') || this.isNew) {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
            next();
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                return next(new Errors.DatabaseError('An error occurred while hashing the password', 'Database'));
            }
            return next(new Errors.DatabaseError('An unknown error occurred while hashing the password', 'Database'));
        }
    }
});

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
