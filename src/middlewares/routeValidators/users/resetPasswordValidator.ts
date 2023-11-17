import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError'

const resetPasswordValidator = [
    body('token')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Token cannot be empty')
        .isLength({ min: 64, max: 64 })
        .withMessage('Token string must be 64 characters long'),

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

    body('confirmPassword').custom((value, { req }) => {
        
        if (value !== req.body.password) {
            throw new Errors.ValidationError('Password confirmation does not match password', 'Confirm Password');
        }
        return true;
    }),

    (req: Request, res: Response, next: NextFunction): Response | void => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            throw new Errors.ValidationError(errorMessages, 'account creation inputs');
        }
        next();
    }
]

export default resetPasswordValidator