import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError';
import { validateToken } from '@utils/jwt';

const verifyUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { userId } = req.params;
    const { authorization } = req.headers;

    if (!userId || userId === ':userId') {
        return next(new Errors.AuthorizationError('UserId parameter must be provided', 'UserId'));
    }

    if (!authorization) {
        return next(
            new Errors.AuthorizationError(
                'Authentication failed: No authorization header provided.',
                'Header authorization',
            ),
        );
    }

    const authParts = authorization.split(' ');
    const authType = authParts[0];
    const authToken = authParts[1];

    if (authType !== 'Bearer' || authParts.length !== 2) {
        return next(
            new Errors.AuthorizationError('Invalid authorization format', 'Header authorization'),
        );
    }

    if (!authToken) {
        return next(
            new Errors.AuthorizationError(
                'Token is not provided or invalid',
                'Authorization Token',
            ),
        );
    }

    if (!process.env.JWT_SECRET) {
        return next(new Errors.EnvironmentError('JWT_SECRET is not defined.', 'env variable'));
    }

    try {
        const decoded = validateToken(authToken) as { userId: string; role: string };

        if (decoded.userId !== userId) {
            return next(new Errors.AuthorizationError('Invalid user ID', 'userId'));
        }

        res.locals.userId = decoded.userId;
        res.locals.role = decoded.role;
        next();
    } catch (error) {
        next(error);
    }
};

export default verifyUserId;
