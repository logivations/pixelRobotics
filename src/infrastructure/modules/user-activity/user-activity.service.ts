import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserActivity } from '../../entities/user.activity.entity';
import { Repository } from 'typeorm';
import { UserActivityDto } from './user-activity.dto';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityEntityRepository: Repository<UserActivity>,
  ) {}

  public async getAll(): Promise<UserActivityDto[]> {
    return await this.userActivityEntityRepository
      .find()
      .then((items) => items.map((e) => UserActivityDto.fromEntity(e)));
  }

  public async create(entity: UserActivity): Promise<UserActivityDto> {
    return this.userActivityEntityRepository
      .save(entity)
      .then((e) => UserActivityDto.fromEntity(e));
  }
}
