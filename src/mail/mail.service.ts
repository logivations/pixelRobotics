import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import MailDataDto from './mail-dto/mail.data.dto';
import { HttpService } from '@nestjs/axios';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private readonly config: EnvironmentConfigService,
  ) {}

  async sendMail(mailData: MailDataDto) {
    const checkCaptchaResponse: { [key: string]: any } = await this.httpService
      .post('https://www.google.com/recaptcha/api/siteverify', null, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          secret: this.config.getSecretCaptchaKey(),
          response: mailData['g-recaptcha-response'],
        },
      })
      .toPromise();

    if (checkCaptchaResponse.success) {
      const { email, name, firma, titel, message } = mailData;

      await this.mailerService.sendMail({
        // to: 'info@pixel-robotics.eu',
        to: 'volodymyr.boichuk@logivations.com',
        from: `${name}<info@pixel-robotics.eu>`,
        subject: 'Kontakt | Pixel Robotics',
        template: 'mailToPixelInfoTemplate',
        headers: [
          { key: 'Mime-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
        ],
        context: { name, email, firma, titel, message },
      });

      await this.mailerService.sendMail({
        // to: 'info@pixel-robotics.eu',
        to: email,
        from: `<info@pixel-robotics.eu>`,
        subject: 'Kontakt | Pixel Robotics',
        template: 'mailToClientTemplate',
        headers: [
          { key: 'Mime-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
        ],
        context: {
          name: name,
        },
      });
    }
  }
}
