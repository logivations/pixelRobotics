import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from "./logger.interceptor";
import { UserActivityService } from "../../modules/user-activity/user-activity.service";
import { UserActivityDto } from "../../modules/user-activity/user-activity.dto";

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(private userActivityService: UserActivityService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    await this.storeUserActivityFromRequest(request);
    return next.handle().pipe();
  }
  
  private async storeUserActivityFromRequest(request: any) {
    const ip = LoggingInterceptor.getIP(request);
    const userActivityDto = UserActivityDto.toEntity({
        userIP: ip,
        visitedPage: request.path || request.url,
        cookieDetail: request.headers.cookie,
        userAgent: request.headers['user-agent'],
        referer: request.headers.referer,
    });

    await this.userActivityService.create(userActivityDto);
  }
}