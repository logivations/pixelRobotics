import {
  Controller,
  Get, Header, Redirect,
  Render,
  Req,
  Res,
  UseInterceptors
} from "@nestjs/common";
import * as careers from '../../../../public/json/vacancies.json';
import { UserActivityInterceptor } from '../../common/interceptors/user.activity.interceptor';
import { FastifyRequest } from 'fastify';
import { getLangFromCookie, getViewNameByLang } from "../../utils";
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

  @Get('news-and-events')
  newsAndEvents(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'news.and.events.ejs'),
      {
        newsCount: this.commonService.getNews('EN_en').length,
        eventsCount: this.commonService.getEvents('EN_en').length
      }
    );
  }

  @Get('news-and-events-details')
  newsAndEventsDetails(@Res() res, @Req() request: FastifyRequest) {
    const event = this.commonService.getEventById(
      request.query['eventId'], getLangFromCookie(request)
    );
    return res.view(
      getViewNameByLang(request, 'news.and.events.details.ejs'),
      { event }
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
  @Render('imprint.ejs')
  imprint(@Res() res, @Req() request: FastifyRequest) {
    return res.view(
      getViewNameByLang(request, 'imprint.ejs')
    );
  }


  // Redirects
  @Get(['shelterinlviv/refugees', 'shelterinlviv/refugees.php'])
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Clear-Site-Data', "\"cache\"")
  @Redirect('/help-ukraine/refugees', 301)
  refugees() {
  }

  @Get(['shelterinlviv', 'shelterinlviv/index.php'])
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Clear-Site-Data', "\"cache\"")
  @Redirect('/help-ukraine/shelter-in-lviv', 301)
  shelterinlviv() {
  }
}
