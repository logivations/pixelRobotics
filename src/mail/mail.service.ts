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
      .request({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          secret: this.config.getSecretCaptchaKey(),
          response: mailData['g-recaptcha-response'],
        },
      }).toPromise();

    if (checkCaptchaResponse.data.success) {
      const { email, name, mailTo, message } = mailData;

      await this.mailerService.sendMail({
        // to: mailTo,
        to: 'volodymyr.boichuk@logivations.com',
        from: `<info@pixel-robotics.eu>`,
        subject: 'Kontakt | Pixel Robotics',
        template: 'mailToPixelInfoTemplate',
        headers: [
          { key: 'Mime-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
        ],
        context: { name, email, message },
      });

      await this.mailerService.sendMail({
        to: email,
        from: `<info@pixel-robotics.eu>`,
        subject: 'Kontakt | Pixel Robotics',
        template: 'mailToClientTemplate',
        headers: [
          { key: 'Mime-Version', value: '1.0' },
          { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
        ],
        context: { name: name },
      });
    }
  }
}
