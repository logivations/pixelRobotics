import { Controller, Get, Render, Req, Res, UseInterceptors } from "@nestjs/common";
import * as careers from '../../../../public/json/vacancies.json';
import { UserActivityInterceptor } from '../../common/interceptors/user.activity.interceptor';
import { FastifyRequest } from "fastify";
import { getViewNameByLang } from "../../utils";

@UseInterceptors(UserActivityInterceptor)
@Controller()
export class ViewController {
  @Get('')
  root(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'index.ejs')
    );
  }

  @Get('career')
  careers(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'careers.ejs'),
      { vacancies: careers.vacancies }
    );
  }
  @Get('contact')
  contact(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'contact.ejs')
    );
  }

  @Get('imprint')
  @Render('imprint.ejs')
  impressum(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'contact.ejs')
    );
  }
}
