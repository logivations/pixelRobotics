import { Module } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { UserActivity } from '../../entities/user.activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../../config/typeorm/typeorm.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([UserActivity]),
    HttpModule,
  ],
  providers: [UserActivityService],
  controllers: [UserActivityController],
  exports: [UserActivityService],
})
export class UserActivityModule {}
