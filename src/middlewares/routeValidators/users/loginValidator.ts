import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password').trim().notEmpty().withMessage('Password is required'),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors
                .array()
                .map(err => err.msg)
                .join(', ');
            return next(new Errors.ValidationError(errorMessages, 'Login'));
        }
        next();
    },
];

export default loginValidator;
