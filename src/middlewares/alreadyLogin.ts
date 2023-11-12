import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError';
import {validateToken} from '@utils/jwt'

const alreadyLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { authorization } = req.headers;

    if (!authorization) {
        // No token, so proceed to the intended route
        return next();
    }
    const authToken = authorization.split(' ')[1];
    const authType = authorization.split(' ')[0];

    if (authType !== 'Bearer' || authorization.split(' ').length !== 2) {
        return next(new Errors.AuthorizationError('Invalid authorization format', 'Header authorization'))
    }

    if (!authToken) {
        return next(new Errors.AuthorizationError('Token is not provided or invalid', 'Authorization Token'))
    }

    if (!process.env.JWT_SECRET) {
        return next(new Errors.EnvironmentError('JWT_SECRET is not defined.', 'env variable'));
    }

    try {
        validateToken(authToken);
        return next(new Errors.AuthorizationError('You are already logged in.', 'Authorization'));
    }
    catch (error) {
        next(error)
    }
};

export default alreadyLogin