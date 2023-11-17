import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError'

const userInfosValidator = [
    body('username')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 5, max: 20 })
        .withMessage('Username must be between 5 and 20 characters long'),

    body('firstName')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('FirstName cannot be empty'),

    body('lastName')
        .optional()
        .trim()
        .isString(),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

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

    body('role')
        .default('super_admin')
        .isString()
        .isIn(['super_admin', 'admin', 'employee'])
        .withMessage('Role must be one of super_admin, admin, or employee'),

    body('membershipType')
        .default('Basic')
        .isString()
        .isIn(['Basic', 'Premium'])
        .withMessage('MembershipType must be one of Basic, Premium'),

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

export default userInfosValidator