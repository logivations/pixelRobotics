import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import MailDataDto from './mail-dto/mail.data.dto';
import { HttpService } from '@nestjs/axios';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';
import SubscribeEventDataDto from "./mail-dto/subscribe.event.data.dto";
import { SentMessageInfo } from "nodemailer";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private readonly config: EnvironmentConfigService,
  ) {}

  async sendMail(mailData: MailDataDto): Promise<SentMessageInfo[]> {
    const checkCaptchaResponse: { [key: string]: any } = await this.httpService
      .request({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          secret: this.config.getSecretCaptchaKey(),
          response: mailData['g-recaptcha-response'],
        },
      })
      .toPromise();
    if (checkCaptchaResponse.data.success) {
    //   console.log("checkCaptchaResponse", checkCaptchaResponse);
      const { email, name, mailTo, message } = mailData;
      try {

        const resultToServer = await this.mailerService.sendMail({
          // to: mailTo,
          to: 'volodymyr.boichuk@logivations.com',
          from: `Pixel Robotics`,
          subject: 'Kontakt | Pixel Robotics',
          template: 'mailToPixelInfoTemplate',
          headers: [
            { key: 'Mime-Version', value: '1.0' },
            { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
          ],
          context: { name, email, message },
        });

        const resultToClient = await this.mailerService.sendMail({
          to: email,
          from: `Pixel Robotics`,
          subject: 'Kontakt | Pixel Robotics',
          template: 'mailToClientTemplate',
          headers: [
            { key: 'Mime-Version', value: '1.0' },
            { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
          ],
          context: { name: name },
        });
      console.log("resultToClient", resultToClient);
      console.log("resultToServer", resultToServer);
      return [resultToClient, resultToServer];

      } catch (error) {
        console.log("error", error);
      }
    }
  }

  public async subscribeToEvent(subscribeData: SubscribeEventDataDto): Promise<SentMessageInfo> {
    const {name, email, company, phone, comment} = subscribeData;
    return this.mailerService.sendMail({
      to: 'volodymyr.boichuk@logivations.com',
      from: email,
      subject: 'EVENT SUBSCRIPTION',
      template: 'subscribeEventMailTemplateToPX',
      headers: [
        { key: 'Mime-Version', value: '1.0' },
        { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
      ],
      context: { name, email, company, phone, comment },
    });
  }
}
