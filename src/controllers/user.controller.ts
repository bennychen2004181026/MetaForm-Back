import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { sendEmail, emailTemplates } from '@utils/emailService';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import Errors from '@errors/ClassError';
import User from '@models/user.model';
import Company from '@models/company.model';
import { IUser } from '@interfaces/users';
import { ICompany } from '@interfaces/company';
import { generateTokenHelper } from '@utils/jwt';
import s3Client from '@utils/s3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const sendVerificationEmail: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const { email, username } = req.body;

        const {
            NODE_ENV,
            JWT_SECRET,
            APP_URL_LOCAL,
            APP_URL_TEST,
            APP_URL_PRODUCTION,
            EMAIL_USERNAME,
            SENDGRID_API_KEY,
        } = process.env;

        if (
            !NODE_ENV ||
            !JWT_SECRET ||
            !APP_URL_LOCAL ||
            !APP_URL_TEST ||
            !APP_URL_PRODUCTION ||
            !EMAIL_USERNAME ||
            !SENDGRID_API_KEY
        ) {
            throw new Errors.EnvironmentError('Missing environment variables', 'env');
        }

        const verificationToken = jwt.sign({ email, username }, JWT_SECRET, { expiresIn: '10m' });

        const appURLs: {
            [key: string]: string | undefined;
            development: string;
            test: string;
            production: string;
        } = {
            development: APP_URL_LOCAL,
            test: APP_URL_TEST,
            production: APP_URL_PRODUCTION,
        };

        const verificationLink = `${appURLs[NODE_ENV]}/users/verification/${verificationToken}`;

        const emailContent = emailTemplates.verification(verificationLink);

        const isEmailSent: boolean = await sendEmail({
            to: email,
            subject: 'Verify your email',
            html: emailContent,
        });

        if (!isEmailSent) {
            throw new Errors.BusinessLogicError('Failed to send verification email');
        }

        return res.status(200).json({
            message: `Verification email has been sent to ${email}. Please check your email.`,
        });
    } catch (error: unknown) {
        next(error);
    }
};

const prepareAccountCreation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const { username, email } = res.locals.decoded;

        if (!username || !email) {
            throw new Errors.ValidationError('Invalid token', 'Token');
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new Errors.DatabaseError('Email already in use', 'Email');
        }

        res.status(200).json({ email, username });
    } catch (error: unknown) {
        next(error);
    }
};

const createAccount: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const { email, username, firstName, lastName, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Errors.ValidationError('Email already in use', 'Email');
        }

        const partialProperties: Partial<IUser> = {
            username,
            firstName,
            lastName,
            email,
            password,
            role: 'super_admin',
            isAccountComplete: false,
            isActive: false,
        };

        const newUser: IUser = new User(partialProperties);
        const savedUser = await newUser.save();

        savedUser.toJSON();

        res.locals.user = savedUser;
        next();
    } catch (error: unknown) {
        next(error);
    }
};

const completeAccount: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { userId } = res.locals;

        if (!userId || userId.trim().length === 0) {
            throw new Errors.NotFoundError('User not found', 'userId');
        }

        const user = await User.findById(userId, null, { session }).exec();

        if (!user) {
            throw new Errors.NotFoundError(
                'User not found in the database',
                'user not found in database',
            );
        }

        const { companyName, abn, logo, industry } = req.body;

        const partialProperties: Partial<ICompany> = {
            companyName,
            abn,
            logo,
            industry,
        };

        const companyInfo: ICompany = new Company({
            ...partialProperties,
            isActive: true,
            employees: [user._id],
        });

        const updatedCompany: ICompany = await companyInfo.save({ session });

        user.company = updatedCompany._id;
        user.isAccountComplete = true;
        user.isActive = true;
        const updatedUser: IUser = await user.save({ session });
        const userJson: IUser = updatedUser.toJSON();

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: 'Successfully bound the company to the user account.Complete account setting',
            updatedCompany,
            userJson,
        });
    } catch (error: unknown) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        next(error);
    }
};

const login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Errors.ValidationError(
                'Email and password are required for login',
                'should provide password and mail',
            );
        }

        const user: IUser | null = await User.findOne({ email }).select('+password').exec();

        if (!user || !user.password) {
            throw new Errors.NotFoundError('User not found or User does not has password', 'User');
        }

        if (user.isActive === false) {
            throw new Errors.AuthorizationError(
                'User already been deactivated',
                'User is not active',
            );
        }

        const comparePassword: boolean = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            throw new Errors.AuthorizationError('Invalid credentials', 'password');
        }

        const token: string = generateTokenHelper(user._id, user.role);

        if (user.isAccountComplete === false || !user.company) {
            return res.status(200).json({
                message: 'Logged in successfully, but require binding company first',
                token,
                user,
                isAccountComplete: false,
            });
        }

        return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user,
            isAccountComplete: true,
        });
    } catch (error: unknown) {
        return next(error);
    }
};

const forgotPassword: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const {
        NODE_ENV,
        JWT_SECRET,
        APP_URL_LOCAL,
        APP_URL_TEST,
        APP_URL_PRODUCTION,
        EMAIL_USERNAME,
        SENDGRID_API_KEY,
    } = process.env;

    if (
        !NODE_ENV ||
        !JWT_SECRET ||
        !APP_URL_LOCAL ||
        !APP_URL_TEST ||
        !APP_URL_PRODUCTION ||
        !EMAIL_USERNAME ||
        !SENDGRID_API_KEY
    ) {
        return next(new Errors.EnvironmentError('Missing environment variables', 'env'));
    }

    const appURLs: {
        [key: string]: string | undefined;
        development: string;
        test: string;
        production: string;
    } = {
        development: APP_URL_LOCAL,
        test: APP_URL_TEST,
        production: APP_URL_PRODUCTION,
    };

    const resetToken: string = crypto.randomBytes(32).toString('hex');
    const passwordExpires: Date = new Date(Date.now() + 600000);

    const resetLink = `${appURLs[NODE_ENV]}/users/resetPassword/${resetToken}`;
    try {
        const { email } = req.body;

        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message:
                    'If your email is registered with us, you will receive a password reset email.',
            });
        }

        await User.findOneAndUpdate(
            { email: user.email },
            { $set: { passwordResetToken: resetToken, passwordResetExpires: passwordExpires } },
        );

        const emailContent: string = emailTemplates.resetPassword(resetLink);

        const isEmailSent: boolean = await sendEmail({
            to: email,
            subject: 'Reset Password',
            html: emailContent,
        });

        if (!isEmailSent) {
            throw new Errors.BusinessLogicError('Failed to send resetPassword email');
        }

        return res.status(200).json({
            message: `ResetPassword email has been sent to ${email}. Please check your email.`,
        });
    } catch (error: unknown) {
        next(error);
    }
};

const resetPassword: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        }).select('+password');

        if (!user) {
            throw new Errors.ValidationError('Invalid or expired password reset token.', 'Token');
        }
        await User.updateOne(
            { _id: user._id },
            {
                $set: { password },
                $unset: {
                    passwordResetToken: '',
                    passwordResetExpires: '',
                },
            },
        );
        res.status(200).json({ message: 'Your password has been successfully reset.' });
    } catch (error) {
        next(error);
    }
};

const getPresignedUrl: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { userId } = res.locals;

    if (!userId || userId.trim().length === 0) {
        throw new Errors.NotFoundError('User not found', 'userId');
    }

    const key = `${userId}/companyLogo-${Date.now()}.jpeg`;
    const { S3_BUCKET_NAME } = process.env;

    if (!S3_BUCKET_NAME) {
        throw new Errors.EnvironmentError(
            'AWS configuration not set in environment variables',
            'env variables',
        );
    }
    try {
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            ContentType: 'image/jpeg',
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

        res.status(200).json({ url: presignedUrl, key });
    } catch (error: unknown) {
        next(error);
    }
};

const getCloudFrontPresignedUrl: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { key } = req.query;

    if (!key) {
        throw new Errors.ValidationError('S3 key not found in param', 's3key');
    }

    if (typeof key !== 'string') {
        throw new Errors.ValidationError('Key must be a string', 's3key');
    }

    const { DISTRIBUTION_DOMAIN_NAME, CLOUDFRONT_PRIVATE_KEY, CLOUDFRONT_KEYPAIR_ID } = process.env;

    if (!DISTRIBUTION_DOMAIN_NAME || !CLOUDFRONT_PRIVATE_KEY || !CLOUDFRONT_KEYPAIR_ID) {
        throw new Errors.EnvironmentError(
            'AWS configuration not set in environment variables',
            'env variables',
        );
    }

    const url = `${DISTRIBUTION_DOMAIN_NAME}/${key}`;
    const date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10); // 10 years

    try {
        const cloudFrontSignedUrl = getCloudFrontSignedUrl({
            url,
            keyPairId: CLOUDFRONT_KEYPAIR_ID,
            privateKey: CLOUDFRONT_PRIVATE_KEY,
            dateLessThan: date.toISOString(),
        });

        res.status(200).json({ cloudFrontSignedUrl });
    } catch (error: unknown) {
        next(error);
    }
};

export default {
    sendVerificationEmail,
    prepareAccountCreation,
    createAccount,
    completeAccount,
    login,
    forgotPassword,
    resetPassword,
    getPresignedUrl,
    getCloudFrontPresignedUrl,
};
