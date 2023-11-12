import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index'

const completeAccountValidator = [
    body('companyName')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Company name is required')
        .isLength({ min: 2, max: 60 })
        .withMessage('Company name should be 2 to 60 characters long'),

    body('abn')
        .notEmpty()
        .withMessage('ABN is required')
        .isLength({ min: 11, max: 11 })
        .withMessage('ABN should be exactly 11 digits'),

    body('logo')
        .optional()
        .isURL()
        .withMessage('Invalid logo URL'),

    body('industry')
        .isArray()
        .notEmpty()
        .withMessage('Industry is required'),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return next(new Errors.ValidationError(errorMessages, 'Company information'));
        }
        next();
    }
]

export default completeAccountValidator