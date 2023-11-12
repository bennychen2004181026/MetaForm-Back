import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index'

const loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return next(new Errors.ValidationError(errorMessages, 'Login information'));
        }
        next();
    }
]

export default loginValidator