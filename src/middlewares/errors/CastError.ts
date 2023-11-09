import { Request, Response, NextFunction } from 'express';
import logger from '@config/utils/winston';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    if (err.name === 'CastError') {
        res.status(400).json({ error: `${err.message} please provide a valid id` });
        return;
    }
    next(err);
};
