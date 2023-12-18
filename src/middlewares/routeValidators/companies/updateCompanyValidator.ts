import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const updateCompanyValidator = [
    body('companyName').trim().isString().notEmpty().withMessage('Company name is required'),

    body('abn')
        .trim()
        .notEmpty()
        .withMessage('ABN is required')
        .isLength({ min: 11, max: 11 })
        .withMessage('ABN should be exactly 11 digits'),

    body('logo').trim().optional().isString(),

    body('industry').trim().isString().notEmpty().withMessage('Industry is required'),

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

export default updateCompanyValidator;
