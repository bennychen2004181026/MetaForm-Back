import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import Errors from '@errors/ClassError';

const verifyHeaderToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new Errors.AuthorizationError('Authentication failed: No authorization header provided.', 'Header authorization'));
    }

    const authParts = authorization.split(' ')
    const authType = authParts[0];
    const authToken = authParts[1];

    if (authType !== 'Bearer' || authParts.length !== 2) {
        return next(new Errors.AuthorizationError('Invalid authorization format', 'Header authorization'))
    }

    if (!authToken) {
        return next(new Errors.AuthorizationError('Token is not provided or invalid', 'Authorization Token'))
    }

    if (!process.env.JWT_SECRET) {
        return next(new Errors.EnvironmentError('JWT_SECRET is not defined.', 'env variable'));
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET) as { userId: string };
        res.locals.userId = decoded.userId;
        next();
    }
    catch (error) {
        next(error);
    }
};

export default verifyHeaderToken
