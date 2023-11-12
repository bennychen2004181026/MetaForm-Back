import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { sendEmail, emailTemplates } from '@utils/emailService';
import Errors from '@errors/ClassError'
import User from '@models/user.model';
import { IUser } from '@customizesTypes/users';

const sendVerificationEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, username } = req.body;

        if (!process.env.JWT_SECRET || !process.env.PORT || !process.env.EMAIL_USERNAME || !process.env.SENDGRID_API_KEY) {
            throw new Errors.EnvironmentError('Missing environment variables', 'env');
        }

        const verificationToken = jwt.sign({ email, username }, process.env.JWT_SECRET, { expiresIn: '10m' });

        const verificationLink = `http://localhost:${process.env.PORT}/users/verify-token/${verificationToken}`;

        const emailContent = emailTemplates.verification(verificationLink);

        const isEmailSent = await sendEmail({ to: email, subject: 'Verify your email', html: emailContent });

        if (!isEmailSent) {
            throw new Errors.BusinessLogicError('Failed to send verification email');
        }

        return res.
            status(200).
            json({ message: `Verification email has been sent to ${email}. Please check your email.` });
    } catch (error) {
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
    } catch (error) {
        next(error)
    }
}

const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, username, firstName, lastName, password } = req.body

        const existingUser = await User.findOne({ $pr: [{ email }, { username }] })

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

        res.locals.user = savedUser
        next();
    } catch (error) {
        next(error)
    }
}

export default {
    sendVerificationEmail,
    prepareAccountCreation,
    createAccount
}