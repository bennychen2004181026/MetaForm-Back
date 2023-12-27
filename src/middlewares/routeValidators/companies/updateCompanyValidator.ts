import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const updateCompanyValidator = [
    body('companyName')
        .trim()
        .isString()
        .withMessage('Company Name should be a string')
        .optional({ checkFalsy: true }),

    body('abn')
        .trim()
        .isLength({ min: 11, max: 11 })
        .withMessage('ABN should be exactly 11 digits')
        .optional({ checkFalsy: true }),

    body('logo')
        .trim()
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Logo should be a url string'),

    body('industry')
        .trim()
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Industry should be a url string'),

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
            return next(
                new Errors.ValidationError(errorMessages, 'Update Company Profile Verification'),
            );
        }
        next();
    },
];

export default updateCompanyValidator;
