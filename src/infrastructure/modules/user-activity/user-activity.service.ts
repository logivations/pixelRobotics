import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserActivity } from '../../entities/user.activity.entity';
import { Repository } from 'typeorm';
import { UserActivityDto } from './user-activity.dto';
import { HttpService } from '@nestjs/axios';
import { Resolution } from './resulutionDto';
import { Request } from 'express';
import { LoggingInterceptor } from '../../common/interceptors/logger.interceptor';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityEntityRepository: Repository<UserActivity>,
    private readonly httpService: HttpService,
  ) {}

  public async getAll(): Promise<UserActivityDto[]> {
    return await this.userActivityEntityRepository
      .find()
      .then((items) => items.map((e) => UserActivityDto.fromEntity(e)));
  }

  public async setResolution(
    request: Request,
    resolution: Resolution,
  ): Promise<void> {
    const ip = LoggingInterceptor.getIP(request);

    const providerDetail = await this.getProviderDetail(ip);

    await this.userActivityEntityRepository
      .createQueryBuilder()
      .update(UserActivity)
      .set({ resolution: `${resolution.width}x${resolution.height}` })
      .andWhere({
        userIP: ip,
        providerDetail,
        userAgent: request.headers['user-agent'],
      })
      .execute();
  }

  public async create(entity: UserActivity): Promise<UserActivityDto> {
    const { entityFromDb, providerDetail } = await this.getEntityFromDB(entity);

    Object.assign(entity, {
      numberOfVisits: (entityFromDb ? entityFromDb.numberOfVisits : 0) + 1,
      providerDetail: providerDetail,
    });

    return this.userActivityEntityRepository
      .save(entity)
      .then((e) => UserActivityDto.fromEntity(e));
  }

  private async getEntityFromDB(entity: UserActivity) {
    const providerDetail = await this.getProviderDetail(entity.userIP);
    const entityFromDb = await this.userActivityEntityRepository.findOne(
      {
        userIP: entity.userIP,
        visitedPage: entity.visitedPage,
        userAgent: entity.userAgent,
        providerDetail: providerDetail,
      },
      { select: ['numberOfVisits', 'id'] },
    );

    return { entityFromDb, providerDetail };
  }

  private async getProviderDetail(userIP: string) {
    const providerData = await this.httpService
      .get(`http://ip-api.com/json/${userIP}`)
      .toPromise();
    // @ts-ignore
    return providerData.status === 'success'
      ? JSON.stringify(providerData.data)
      : '{}';
  }
}
