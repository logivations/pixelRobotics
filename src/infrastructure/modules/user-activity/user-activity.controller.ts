import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { UserActivityDto } from './user-activity.dto';
import { Resolution } from './resulutionDto';
import { Request } from 'express';

@Controller('api/user-activity')
export class UserActivityController {
  constructor(private userActivityService: UserActivityService) {}

  @Get()
  public async getAll() {
    return await this.userActivityService.getAll();
  }

  @Post('setResolution')
  public async setResolution(
    @Req() request: Request,
    @Body() resolution: string,
  ): Promise<void> {
    const parsedResolution = new Resolution(resolution ? JSON.parse(resolution) : {});
    await this.userActivityService.setResolution(request, parsedResolution);
  }

  @Post()
  public async post(
    @Body() userActivityDto: UserActivityDto,
  ): Promise<UserActivityDto> {
    return this.userActivityService.create(userActivityDto);
  }
}
