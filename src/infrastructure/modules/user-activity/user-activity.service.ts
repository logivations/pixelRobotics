import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserActivity } from '../../entities/user.activity.entity';
import { Repository } from 'typeorm';
import { UserActivityDto } from './user-activity.dto';
import { HttpService } from "@nestjs/axios";

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityEntityRepository: Repository<UserActivity>,
    private readonly httpService: HttpService
  ) {}

  public async getAll(): Promise<UserActivityDto[]> {
    return await this.userActivityEntityRepository
      .find()
      .then((items) => items.map((e) => UserActivityDto.fromEntity(e)));
  }

  public async create(entity: UserActivity): Promise<UserActivityDto> {
    const providerDetail = await (async () => {
      // const providerData = await this.httpService.get(`http://ip-api.com/json/${entity.userIP}`).toPromise();
      const providerData = await this.httpService.get(`http://ip-api.com/json/93.170.25.23`).toPromise();
      // @ts-ignore
      return providerData.status === 'success' ? JSON.stringify(providerData.data) : '{}';
    })();
    console.log("providerDetail", providerDetail);
    const entityFromDb = await this.userActivityEntityRepository.findOne({
      userIP: entity.userIP,
      visitedPage: entity.visitedPage,
      userAgent: entity.userAgent,
      providerDetail: providerDetail,
    }, {select: ["numberOfVisits"]});


    console.log("providerDetail", entityFromDb);
    Object.assign(entity, {
      numberOfVisits: (entityFromDb ? entityFromDb.numberOfVisits : 0) + 1,
      providerDetail: providerDetail
    });
    return this.userActivityEntityRepository
      .save(entity)
      .then((e) => UserActivityDto.fromEntity(e));
  }
}
