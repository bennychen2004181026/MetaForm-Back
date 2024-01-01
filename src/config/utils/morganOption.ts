import { Request, Response } from 'express';
import { Options } from 'morgan';
import logger from '@config/utils/winston';

const morganOption: Options<Request, Response> = {
    // Define stream with write function signature
    stream: {
        write: (message: string): void => {
            // Use the 'info' log level so the output will be picked up by both transports (file and console)
            logger.info(message.trim());
        },
    },
};

export default morganOption;
