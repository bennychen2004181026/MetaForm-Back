import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import Errors from '@errors/ClassError';

const generateToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        return next(
            new Errors.EnvironmentError(
                'JWT_SECRET or JWT_EXPIRES_IN are not defined.',
                'env variables',
            ),
        );
    }

    const { user } = res.locals;

    if (!user || !user._id) {
        return next(new Errors.BusinessLogicError('User information not found', 'userId'));
    }

    try {
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.locals.token = token;
        next();
    } catch (error: unknown) {
        return next(error);
    }
};

export default generateToken;
