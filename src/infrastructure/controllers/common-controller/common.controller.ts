import { Controller, Get, Render, Req } from "@nestjs/common";
import { CommonService } from "./common.service";
import { FastifyRequest } from "fastify";
import { getLangFromCookie } from "../../utils";

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
  ) {}

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
    return this.commonService.getSortedByDateNewsAndEvents(getLangFromCookie(request));
  }


}