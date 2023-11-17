import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { sendEmail, emailTemplates } from '@utils/emailService';
import Errors from '@errors/ClassError'
import User from '@models/user.model';

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
    } catch (error) {
        next(error)
    }
}

export default {
    sendVerificationEmail,
    prepareAccountCreation
}