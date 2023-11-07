import { Request, Response, NextFunction } from 'express';
import logger from '@config/utils/winston';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(500).json({ err: 'Unexpected error happened, please try again later' });
};
