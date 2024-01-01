import { Request, Response, NextFunction } from 'express';
import User from '@models/user.model';
import Errors from '@errors/ClassError';

const checkUserExistence = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new Errors.AuthorizationError('Email is already in use.', 'Email'));
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default checkUserExistence;
