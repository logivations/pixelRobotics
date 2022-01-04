import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { UserActivityDto } from './user-activity.dto';

@Controller('api/user-activity')
export class UserActivityController {
  constructor(private userActivityService: UserActivityService) {}

  @Get()
  public async getAll() {
    console.log('GETTTT');
    return await this.userActivityService.getAll();
  }

  @Post()
  public async post(
    @Body() userActivityDto: UserActivityDto,
  ): Promise<UserActivityDto> {
    return this.userActivityService.create(userActivityDto);
  }
}
