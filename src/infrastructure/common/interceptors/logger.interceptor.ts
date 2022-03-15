import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../logger/logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const ip = LoggingInterceptor.getIP(request);

    this.logger.log(
      `Incoming Request on ${request.path || request.url}`,
      `method=${request.method} ip=${ip}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `End Request for ${request.path || request.url}`,
          `method=${request.method} ip=${ip} duration=${Date.now() - now}ms`,
        );
      }),
    );
  }

  public static getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}
