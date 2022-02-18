import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import * as careers from '../../../../public/json/vacancies.json';
import { UserActivityInterceptor } from '../../common/interceptors/user.activity.interceptor';

@UseInterceptors(UserActivityInterceptor)
@Controller()
export class ViewController {
  @Get('')
  @Render('index.ejs')
  root() {
    return {};
  }

  @Get('career')
  @Render('careers.ejs')
  careers() {
    return { vacancies: careers.vacancies };
  }
  @Get('contact')
  @Render('contact.ejs')
  contact() {
    return {};
  }
  @Get('imprint')
  @Render('imprint.ejs')
  impressum() {
    return {};
  }
}
