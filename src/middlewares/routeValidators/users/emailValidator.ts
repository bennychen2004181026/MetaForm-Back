import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const emailValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    body('username')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 5, max: 20 })
        .withMessage('Username must be between 5 and 20 characters long'),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors
                .array()
                .map(err => err.msg)
                .join(', ');
            return next(
                new Errors.ValidationError(errorMessages, 'Email and Username Verification'),
            );
        }
        next();
    },
];

export default emailValidator;
