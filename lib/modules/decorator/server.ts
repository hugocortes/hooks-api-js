import * as hapi from 'hapi';
import * as winston from 'winston';

import { ServerOpts } from './interfaces';

const DECORATE_TYPE = 'server';

/**
 * Creates the winston logger
 *
 * @param level Log level to use
 * @param label Apply a logging tag to all messages
 */
function createLogger(level: string, label: string): any {
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    db: 5,
    test: 6,
  };
  const colors = {
    test: 'bold red cyanBG',
    db: 'bold white',
  };

  winston.addColors(colors);

  const logger = winston.createLogger({
    level: level || 'error',
    levels: levels,
    format: winston.format.combine(
      winston.format.label({ label: label }),
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(
        (info): string => {
          return `${info.timestamp} ${info.level} [${info.label}] ${
            info.message
          }`;
        }
      )
    ),
    transports: [
      new winston.transports.Console({
        level: level || 'error',
        stderrLevels: ['error', 'warn'],
      }),
    ],
  });

  return logger;
}

export function init(server: hapi.Server, serverOpts: ServerOpts): void {
  const logger = createLogger(serverOpts.level, serverOpts.label);
  server.decorate(DECORATE_TYPE, 'logger', logger);
}
