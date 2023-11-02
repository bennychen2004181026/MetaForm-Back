import { Request, Response, NextFunction } from 'express';
import logger from '@config/utils/winston';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
        return;
    }
    next(err);
};
