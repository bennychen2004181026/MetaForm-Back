import { createLogger, format, transports } from 'winston';

const { combine, printf } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    format.timestamp(),
    printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`),
  ),
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
}

export default logger;
