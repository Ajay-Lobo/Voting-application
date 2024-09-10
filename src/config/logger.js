import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Convert import.meta.url to __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define log directory and file paths
const logDir = join(__dirname, '../../logs'); // Adjust path to point to the 'logs' directory

// Ensure the log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true }); // Create 'logs' directory if it doesn't exist
}

// Create Winston logger
const logger = createLogger({
  level: 'info',  // Minimum level of logging
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [
    // Daily rotate file transport for errors
    new DailyRotateFile({
      filename: join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d', // Retain logs for 14 days
    }),

    // Daily rotate file transport for combined logs
    new DailyRotateFile({
      filename: join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Retain logs for 14 days
    }),

    // Console transport (optional)
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
      ),
    }),
  ],
});

export default logger;
