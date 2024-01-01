import { Response, Request, NextFunction } from 'express';
import CustomError from '@errors/ClassError/CustomError';
import logger from '@config/utils/winston';

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void => {
    if (err instanceof CustomError) {
        logger.error(`[${err.constructor.name}] - ${err.message}`);
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    logger.error(`[${err.name}] - ${err.message}`, err.stack);

    const fallbackStatusCode = 500;

    const statusCode =
        typeof (err as { statusCode?: number }).statusCode === 'number'
            ? (err as unknown as { statusCode: number }).statusCode
            : fallbackStatusCode;

    const errorResponse = {
        errors: [
            {
                name: err.name,
                message: err.message,
                statusCode,
            },
        ],
    };
    return res.status(statusCode).send(errorResponse);
};

export default errorHandler;
