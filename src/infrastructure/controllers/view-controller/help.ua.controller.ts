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
  refugees(@Res() res, @Req() request: FastifyRequest) {
    const lang = request.cookies['lang'];
    const viewName = `help-ukraine/${lang && lang === "DE_de" ? 'de' : 'en'}.refugees.ejs`;
    return res.view(viewName);
  }
  @Get('shelter-in-lviv')
  @Render('help-ukraine/shelter.in.lviv.ejs')
  shelterInLviv(@Res() res, @Req() request: FastifyRequest) {}
}
