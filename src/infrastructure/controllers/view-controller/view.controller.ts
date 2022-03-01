import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import * as careers from '../../../../public/json/vacancies.json';
import { UserActivityInterceptor } from '../../common/interceptors/user.activity.interceptor';
import { FastifyRequest } from 'fastify';
import { getViewNameByLang } from "../../utils";
import { CommonService } from "../common-controller/common.service";

@UseInterceptors(UserActivityInterceptor)
@Controller()
export class ViewController {
  constructor(
    private commonService: CommonService
  ) {}

  @Get('')
  root(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'index.ejs')
    );
  }

  @Get('newsAndEvents')
  newsAndEvents(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'news.and.events.ejs'),
      {
        newsCount: this.commonService.getNews('en').length,
        eventsCount: this.commonService.getEvents('en').length
      }
    );
  }

  @Get('career')
  career(@Res() res, @Req() request: FastifyRequest) {
    const lang = request.cookies['lang'];
    const vacancies = careers[lang && lang === "DE_de" ? 'vacanciesDE' : 'vacanciesEN'];
    return res.view(
      getViewNameByLang(request, 'careers.ejs'),
      { vacancies }
    );
  }

  @Get('contact')
  contact(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'contact.ejs')
    );
  }

  @Get('imprint')
  @Render('en.imprint.ejs')
  imprint(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'imprint.ejs')
    );
  }

}
