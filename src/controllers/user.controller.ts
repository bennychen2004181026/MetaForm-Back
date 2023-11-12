import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { sendEmail, emailTemplates } from '@utils/emailService';
import Errors from '@errors/ClassError'

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
    
}

export default {
    sendVerificationEmail,
    prepareAccountCreation
}