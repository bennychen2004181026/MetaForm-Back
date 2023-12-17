import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const addEmployeeValidator = [
    body('username')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 5, max: 20 })
        .withMessage('Username must be between 5 and 20 characters long'),

    body('firstName').trim().isString().notEmpty().withMessage('FirstName cannot be empty'),

    body('lastName').optional().trim().isString(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isString()
        .isLength({ min: 8, max: 32 })
        .withMessage('Password must be at least 8 to 32 characters long')
        .matches(/[0-9]/)
        .withMessage('Password must contain a number')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/[!@#$%^_&*]/)
        .withMessage('Password must contain a special character (@,#,$,%,^,_,&,*,!)'),

    body('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Confirm Password cannot be empty')
        .isString(),

    body('token')
        .trim()
        .isString()
        .withMessage('Token is not a string')
        .notEmpty()
        .withMessage('Token cannot be empty')
        .isLength({ min: 64, max: 64 })
        .withMessage('Token string must be 64 characters long'),

    param('companyId')
        .trim()
        .isString()
        .withMessage('Company Id is a string')
        .notEmpty()
        .withMessage('Company Id is required'),

    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Errors.ValidationError(
                'Password confirmation does not match password',
                'Confirm Password',
            );
        }
        return true;
    }),

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

export default addEmployeeValidator;
