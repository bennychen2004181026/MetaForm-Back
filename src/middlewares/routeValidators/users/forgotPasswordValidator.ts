import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index'

const forgotPasswordValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email needed to send verify email')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return next(new Errors.ValidationError(errorMessages, 'Email'));
        }
        next();
    }
];

export default forgotPasswordValidator