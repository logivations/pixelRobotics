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
@Controller('help-ukraine')
export class HelpUaController {
  @Get('refugees')
  @Render('help-ukraine/refugees.ejs')
  refugees(@Res() res, @Req() request: FastifyRequest) {
    return 123;
  }
  @Get('shelter-in-lviv')
  @Render('help-ukraine/shelter.in.lviv.ejs')
  shelterInLviv(@Res() res, @Req() request: FastifyRequest) {
    return 123;
  }

}
