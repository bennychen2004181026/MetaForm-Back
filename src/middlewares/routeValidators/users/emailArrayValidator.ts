import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError/index';

const emailArrayValidator = [
    body('emails')
        .isArray()
        .withMessage('Emails must be an array')
        .bail()
        .notEmpty()
        .withMessage('Email array cannot be empty')
        .bail()
        .custom((emails: string[]) =>
            emails.every((email: string) =>
                body('dummy')
                    .isEmail()
                    .withMessage('Email must be valid')
                    .run({ body: { dummy: email } }),
            ),
        )
        .withMessage('All items in the array must be valid emails'),

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
