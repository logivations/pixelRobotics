import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';

const config = {
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      dirname: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/logs.log',
      level: 'info',
      dirname: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/warnings.log',
      level: 'warn',
      dirname: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
  ],
};

export default config;
