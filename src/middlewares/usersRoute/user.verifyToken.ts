import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Errors from '@errors/ClassError'

const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { token } = req.params;

        if (!token) {
            return next(new Errors.ValidationError('Token not provided', 'token'))
        }

        if (!process.env.JWT_SECRET) {
            return next(new Errors.EnvironmentError('JWT secret not defined', 'env'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.locals.decoded = decoded

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new Errors.ValidationError('Invalid or expired token', 'token'))
        }
        next(error)
    }
}

export default verifyToken