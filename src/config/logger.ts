// src/config/logger.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';

const logDirectory = path.join(__dirname, '../../logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
  ],
});

export default logger;
