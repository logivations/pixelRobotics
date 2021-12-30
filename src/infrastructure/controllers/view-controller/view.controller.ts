import { Get, Controller, Render } from '@nestjs/common';
import * as careers from '../../../../public/json/vacancies.json';

@Controller()
export class ViewController {
  @Get('')
  @Render('index.ejs')
  root() {
    return { message: 'Hello world!' };
  }

  @Get('about')
  @Render('about.ejs')
  about() {
    return { message: 'Hello world!' };
  }

  @Get('careers')
  @Render('careers.ejs')
  careers() {
    return { vacancies: careers.vacancies };
  }
  @Get('contact')
  @Render('contact.ejs')
  contact() {
    return { message: 'Hello world!' };
  }
}
