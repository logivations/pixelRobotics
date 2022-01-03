import { Controller, Get, Render } from '@nestjs/common';
import * as careers from '../../../../public/json/vacancies.json';

@Controller()
export class ViewController {
  @Get('')
  @Render('index.ejs')
  root() {
    return {};
  }

  @Get('about')
  @Render('about.ejs')
  about() {
    return {};
  }

  @Get('careers')
  @Render('careers.ejs')
  careers() {
    return { vacancies: careers.vacancies };
  }
  @Get('contact')
  @Render('contact.ejs')
  contact() {
    return {};
  }
  @Get('impressum')
  @Render('impressum.ejs')
  impressum() {
    return {};
  }
}
