import {
  ArgumentsHost,
  Catch,
  Inject,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerService } from '../../logger/logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

interface IError {
  message: string;
  code_error: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: exception.message, code_error: null };

    const responseData = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      ...message,
    };
    this.logMessage(request, message, status, exception);
    this.sendErrorPage(response, status, message);
    // response.status(status).json(responseData);
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
    exception: any,
  ) {
    if (status >= 500) {
      this.logger.error(
        `End Request for ${request.path || request.url}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path || request.url}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
      );
    }
  }

  private sendErrorPage(response: Response, status: number, message) {
    if (status === HttpStatus.NOT_FOUND) {
      response.status(HttpStatus.NOT_FOUND).sendFile('./404.html', (err) => {
        this.logger.error(
          `End Request for 404.html`,
          `method=GET status=${status} code_error=${
            err.name ? err.name : null
          } message=${err.message ? err.message : null}`,
          err.stack || '',
        );
      });
    }
  }
}
