import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Errors from '@errors/ClassError'

const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const { token } = req.params;

    try {
        if (!process.env.JWT_SECRET) {
            throw new Errors.EnvironmentError('JWT secret not defined', 'env')
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