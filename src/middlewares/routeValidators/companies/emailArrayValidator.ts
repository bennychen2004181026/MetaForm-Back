import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const emailArrayValidator = [
    body('emails').isArray().withMessage('Emails must be an array'),

    body('emails.*')
        .notEmpty()
        .withMessage('Email is empty in the array')
        .isEmail()
        .withMessage('All items in the array must be valid emails'),

    param('companyId')
        .trim()
        .isString()
        .withMessage('Company Id is a string')
        .notEmpty()
        .withMessage('Company Id is required'),

    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors
                .array()
                .map(err => err.msg)
                .join(', ');
            return next(new Errors.ValidationError(errorMessages, 'Email Array Verification'));
        }
        next();
    },
];

export default emailArrayValidator;
