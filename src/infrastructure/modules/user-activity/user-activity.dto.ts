import { UserActivityModel } from '../../../domain/model/user.activity';
import { UserActivity } from '../../entities/user.activity.entity';

export class UserActivityDto implements Readonly<UserActivityDto> {
  id: number;
  userIP: string;
  visitedPage: string;
  dateTime: string;
  cookieDetail: string;
  browser: string;
  browserDetail: string;
  userInfo: string;
  providerDetail: string;
  referer: string;

  public static from(dto: Partial<UserActivityDto>) {
    const userActivityDto = new UserActivityDto();

    userActivityDto.id = dto.id;
    userActivityDto.userIP = dto.userIP;
    userActivityDto.visitedPage = dto.visitedPage;
    userActivityDto.dateTime = dto.dateTime;
    userActivityDto.cookieDetail = dto.cookieDetail;
    userActivityDto.browser = dto.browser;
    userActivityDto.browserDetail = dto.browserDetail;
    userActivityDto.userInfo = dto.userInfo;
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
      browser: entity.browser,
      browserDetail: entity.browserDetail,
      userInfo: entity.userInfo,
      providerDetail: entity.providerDetail,
      referer: entity.referer,
    });
  }

  public toEntity(activityModel: UserActivityModel = null) {
    const userActivity = new UserActivity();
    activityModel = activityModel || this;

    userActivity.id = activityModel.id;
    userActivity.userIP = activityModel.userIP;
    userActivity.visitedPage = activityModel.visitedPage;
    userActivity.dateTime = activityModel.dateTime;
    userActivity.cookieDetail = activityModel.cookieDetail;
    userActivity.browser = activityModel.browser;
    userActivity.browserDetail = activityModel.browserDetail;
    userActivity.userInfo = activityModel.userInfo;
    userActivity.providerDetail = activityModel.providerDetail;
    userActivity.referer = activityModel.referer;

    return userActivity;
  }
}
