import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { sendEmail, emailTemplates } from '@utils/emailService';
import Errors from '@errors/ClassError'
import User from '@models/user.model';
import Company from '@models/company.model';
import { IUser } from '@customizesTypes/users';
import { ICompany } from '@customizesTypes/companies';
import { generateTokenHelper } from '@utils/jwt'

const sendVerificationEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, username } = req.body;

        const {
            NODE_ENV,
            JWT_SECRET,
            PORT,
            EMAIL_USERNAME,
            SENDGRID_API_KEY
        } = process.env

        if (!NODE_ENV || !JWT_SECRET || !PORT || !EMAIL_USERNAME || !SENDGRID_API_KEY) {
            throw new Errors.EnvironmentError('Missing environment variables', 'env');
        }

        const verificationToken = jwt.sign({ email, username }, JWT_SECRET, { expiresIn: '10m' });

        let verificationLink: string;
        if (NODE_ENV === 'production') {
            verificationLink = `http://localhost:${process.env.PORT}/users/verification/${verificationToken}`;
        } else if (NODE_ENV === 'test') {
            verificationLink = `http://localhost:${process.env.PORT}/users/verification/${verificationToken}`;
        } else {
            verificationLink = `http://localhost:${process.env.PORT}/users/verification/${verificationToken}`;
        }

        const emailContent = emailTemplates.verification(verificationLink);

        const isEmailSent: boolean = await sendEmail({ to: email, subject: 'Verify your email', html: emailContent });

        if (!isEmailSent) {
            throw new Errors.BusinessLogicError('Failed to send verification email');
        }

        return res.
            status(200).
            json({ message: `Verification email has been sent to ${email}. Please check your email.` });
    } catch (error: unknown) {
        next(error);
    }
};

const prepareAccountCreation: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { username, email } = res.locals.decoded;

        if (!username || !email) {
            throw new Errors.ValidationError('Username or email not provided', 'token')
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] })

        if (userExists) {
            throw new Errors.DatabaseError('Email or username already in use', 'user')
        }

        res.status(200).json({ email, username })
    } catch (error: unknown) {
        next(error)
    }
}

const createAccount: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, username, firstName, lastName, password } = req.body

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })

        if (existingUser) {
            throw new Errors.ValidationError('Email or username already in use', 'email/username')
        }

        const partialProperties: Partial<IUser> = {
            username,
            firstName,
            lastName,
            email,
            password,
            role: "super_admin",
            isAccountComplete: false,
            isActive: false,
        };

        const newUser: IUser = new User(partialProperties);
        const savedUser = await newUser.save();

        savedUser.toJSON();

        res.locals.user = savedUser;
        next();
    } catch (error: unknown) {
        next(error)
    }
}

const completeAccount: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { userId } = res.locals;

        if (!userId || userId.trim() === '') {
            throw new Errors.NotFoundError('User not found', 'userId');
        }

        const user = await User.findById(userId).exec()

        if (!user) {
            throw new Errors.NotFoundError('User not found in the database', 'user not found in database');
        }

        const {
            companyName,
            abn,
            logo,
            industry,
        } = req.body;

        const partialProperties: Partial<ICompany> = {
            companyName,
            abn,
            logo,
            industry,
        }

        const companyInfo: ICompany = new Company({
            ...partialProperties,
            isActive: true,
            employees: [user._id],
        });

        const updatedCompany: ICompany = await companyInfo.save();

        user.company = updatedCompany._id;
        user.isAccountComplete = true;
        user.isActive = true;
        const updatedUser: IUser = await user.save();
        const userJson: IUser = updatedUser.toJSON();

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: 'Successfully bound the company to the user account.Complete account setting',
            updatedCompany,
            userJson
        });
    }
    catch (error: unknown) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        next(error);
    }
};

const login: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Errors.ValidationError('Email and password are required for login', 'should provide password and mail');
        }

        const user: IUser | null = await User.findOne({ email }).select('+password').exec();

        if (!user || !user.password) {
            throw new Errors.NotFoundError('User not found or User does not has password', 'User');
        }

        const comparePassword: boolean = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            throw new Errors.AuthorizationError('Invalid credentials', 'password');
        }

        const token: string = generateTokenHelper(user._id, user.role);

        return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user
        });
    }
    catch (error: unknown) {
        return next(error);
    }
};

const forgotPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const {
        NODE_ENV,
        JWT_SECRET,
        PORT,
        EMAIL_USERNAME,
        SENDGRID_API_KEY
    } = process.env

    if (!NODE_ENV || !JWT_SECRET || PORT || EMAIL_USERNAME || SENDGRID_API_KEY) {
        return next(new Errors.EnvironmentError('Missing environment variables', 'env'));
    }

    const resetToken: string = crypto.randomBytes(32).toString('hex');
    const passwordExpires: Date = new Date(Date.now() + 600000);

    let resetLink: string;
    if (NODE_ENV === 'production') {
        resetLink = `http://localhost:${process.env.PORT}/users/resetPassword/${resetToken}`;
    } else if (NODE_ENV === 'test') {
        resetLink = `http://localhost:${process.env.PORT}/users/resetPassword/${resetToken}`;
    } else {
        resetLink = `http://localhost:${process.env.PORT}/users/resetPassword/${resetToken}`;
    }

    try {
        const { email } = req.body;

        const user: IUser | null = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ message: 'If your email is registered with us, you will receive a password reset email.' })
        }


        await User.findOneAndUpdate(
            { email: user.email },
            { $set: { passwordResetToken: resetToken, passwordResetExpires: passwordExpires } },
        )

        const emailContent: string = emailTemplates.resetPassword(resetLink);

        const isEmailSent: boolean = await sendEmail({ to: email, subject: 'Reset Password', html: emailContent });

        if (!isEmailSent) {
            throw new Errors.BusinessLogicError('Failed to send resetPassword email');
        }

        return res.
            status(200).
            json({ message: `ResetPassword email has been sent to ${email}. Please check your email.` });
    } catch (error: unknown) {
        next(error)
    }
}

const resetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { token, password } = req.body

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            throw new Errors.ValidationError('Invalid or expired password reset token.', 'Token')
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();
        res.status(200).json({ message: 'Your password has been successfully reset.' });
    } catch (error) {
        next(error)
    }
}

export default {
    sendVerificationEmail,
    prepareAccountCreation,
    createAccount,
    completeAccount,
    login,
    forgotPassword,
    resetPassword
}