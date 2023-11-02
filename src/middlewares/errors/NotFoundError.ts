import { Request, Response, NextFunction } from 'express';
import logger from '@config/utils/winston';
import NotFoundException from '@middleware/exceptions/NotFoundException';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    if (err instanceof NotFoundException) {
        res.status(404).json({ error: err.message });
        return;
    }
    next(err);
};
