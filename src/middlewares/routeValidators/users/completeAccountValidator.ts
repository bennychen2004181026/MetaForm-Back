import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const completeAccountValidator = [
    body('companyName').trim().isString().notEmpty().withMessage('Company name is required'),

    body('abn')
        .notEmpty()
        .withMessage('ABN is required')
        .isLength({ min: 11, max: 11 })
        .withMessage('ABN should be exactly 11 digits'),

    body('logo').optional().isString(),

    body('industry').isString().notEmpty().withMessage('Industry is required'),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors
                .array()
                .map(err => err.msg)
                .join(', ');
            return next(new Errors.ValidationError(errorMessages, 'Company1 information'));
        }
        next();
    },
];

export default completeAccountValidator;
