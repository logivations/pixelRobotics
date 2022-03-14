import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserActivityInterceptor } from '../../common/interceptors/user.activity.interceptor';
import { FastifyRequest } from 'fastify';

@UseInterceptors(UserActivityInterceptor)
@Controller('shelterinlviv')
export class ShelterInLvivController {
  @Get('refugees')
  @Render('shelterinlviv/refugees.ejs')
  refugees(@Res() res, @Req() request: FastifyRequest) {
    return 123;
  }
  @Get('shelter-in-lviv')
  @Render('shelterinlviv/shelter.in.lviv.ejs')
  shelterInLviv(@Res() res, @Req() request: FastifyRequest) {
    return 123;
  }

}
