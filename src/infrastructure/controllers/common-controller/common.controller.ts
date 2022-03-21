import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { CommonService } from './common.service';
import { FastifyRequest } from 'fastify';
import { getLangFromCookie } from '../../utils';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('getNews')
  getNews(@Req() request: FastifyRequest) {
    return this.commonService.getNews(getLangFromCookie(request));
  }

  @Get('getEvents')
  getEvents(@Req() request: FastifyRequest) {
    return this.commonService.getEvents(getLangFromCookie(request));
  }

  @Get('getSortedByDateNewsAndEvents')
  getSortedByDateNewsAndEvents(@Req() request: FastifyRequest) {
    return this.commonService.getSortedByDateNewsAndEvents(
      getLangFromCookie(request),
    );
  }

  @Get('getEventById')
  getEventById(
    @Req() request: FastifyRequest,
    @Query('eventId') eventId: string,
  ) {
    return this.commonService.getEventById(eventId, getLangFromCookie(request));
  }

  @Get('template')
  template(
    @Query('eventId') eventId: string,
    @Res() res,
    @Req() request: FastifyRequest,
  ) {
    const event: { [key: string]: any } = this.commonService.getEventById(
      eventId,
      getLangFromCookie(request),
    );
    return res.view(`templates/${event.templateName}`);
  }
}
