import { UserActivityModel } from '../../../domain/model/user.activity';
import { UserActivity } from '../../entities/user.activity.entity';
import { v4 as uuidv4 } from 'uuid';

export class UserActivityDto implements Readonly<UserActivityDto> {
  public id: string;
  public userIP: string;
  public visitedPage: string;
  public dateTime: Date;
  public cookieDetail: string;
  public userAgent: string;
  public plugins: string;
  public numberOfVisits: number;
  public resolution: string;
  public providerDetail: string;
  public referer: string;

  public static toEntity(
    activityModel: UserActivityModel = null,
  ): UserActivity {
    const userActivityDto = new UserActivityDto();
    return userActivityDto.toEntity(activityModel);
  }

  public static from(dto: Partial<UserActivityDto>) {
    const userActivityDto = new UserActivityDto();

    userActivityDto.userIP = dto.userIP;
    userActivityDto.visitedPage = dto.visitedPage;
    userActivityDto.cookieDetail = dto.cookieDetail;
    userActivityDto.userAgent = dto.userAgent;
    userActivityDto.numberOfVisits = dto.numberOfVisits;
    userActivityDto.plugins = dto.plugins;
    userActivityDto.resolution = dto.resolution;
    userActivityDto.providerDetail = dto.providerDetail;
    userActivityDto.referer = dto.referer;

    return userActivityDto;
  }

  public static fromEntity(entity: UserActivity) {
    return this.from({
      id: entity.id,
      userIP: entity.userIP,
      visitedPage: entity.visitedPage,
      dateTime: entity.dateTime,
      cookieDetail: entity.cookieDetail,
      userAgent: entity.userAgent,
      plugins: entity.plugins,
      numberOfVisits: entity.numberOfVisits,
      resolution: entity.resolution,
      providerDetail: entity.providerDetail,
      referer: entity.referer,
    });
  }

  public toEntity(activityModel: UserActivityModel = null): UserActivity {
    const userActivity = new UserActivity();
    // @ts-ignore
    activityModel = activityModel || this;

    userActivity.id = uuidv4();
    userActivity.userIP = activityModel.userIP;
    userActivity.visitedPage = activityModel.visitedPage;
    userActivity.cookieDetail = activityModel.cookieDetail;
    userActivity.userAgent = activityModel.userAgent;
    userActivity.numberOfVisits = activityModel.numberOfVisits;
    userActivity.plugins = activityModel.plugins;
    userActivity.resolution = activityModel.resolution;
    userActivity.providerDetail = activityModel.providerDetail;
    userActivity.referer = activityModel.referer;

    return userActivity;
  }
}
