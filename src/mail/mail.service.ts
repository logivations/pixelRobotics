import { Inject, Injectable } from "@nestjs/common";
import MailDataDto from './mail-dto/mail.data.dto';
import { HttpService } from '@nestjs/axios';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';
import { SMTPClient } from 'emailjs';

import * as ejs from 'ejs';
import * as path from 'path';
import { MessageHeaders } from 'emailjs/smtp/message';
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoggerService } from "../infrastructure/logger/logger.service";

@Injectable()
export class MailService {
  private mailClient: SMTPClient;
  constructor(
    private readonly httpService: HttpService,
    private readonly config: EnvironmentConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {
    // this.mailClient = new SMTPClient({
    //   user: this.config.getMailUser(),
    //   password: this.config.getMailPassword(),
    //   host: this.config.getMailHost(),
    //   port: this.config.getMailPort(),
    //   ssl: false,
    //   logger: (...args) => {
    //     console.log('args', args);
    //   },
    // });
    this.mailClient = new SMTPClient({
      user: 'wp1169253-w2motest',
      password: '13.test.T.79',
      host: 'wp1169253.mailout.server-he.de',
      port: 587,
      ssl: false,
      logger: (...args) => {
        console.log('args', args);
      },
    });
  }

  async sendMail(mailData: MailDataDto): Promise<any> {
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
      const { email, name, iWantToTalkWith, message } = mailData;
      try {
        const resultToServer = await this.sendMailWithTemplate(
          'mailToPixelInfoTemplate.ejs',
          { name, email, message, iWantToTalkWith },
          {
            to: 'volodymyr.boichuk@logivations.com',
            subject: 'Kontakt | Pixel Robotics',
            cc: 'Сhristina <christina.kiselova@pixel-robotics.eu>',
            // cc: 'Volodymyr <volodymyr.boichuk@logivations.com>'
          },
        );
        const resultToClient = await this.sendMailWithTemplate(
          'mailToClientTemplate.ejs',
          { name },
          {
            to: email,
            subject: 'Kontakt | Pixel Robotics',
          },
        );
        this.logger.log(JSON.stringify(resultToServer), 'resultToServer');
        return [resultToServer, resultToClient];
      } catch (err) {
        const error = new Error(err);
        this.logger.error(err.message, err.name, err.stack);
        console.log('error', error);
      }
    }
  }

  public async subscribeToEvent(subscribeData: {
    [key: string]: any;
  }): Promise<any> {
    const {
      sendMailDetail: { mailTo, subject, emailTemplate },
      mailData,
    } = subscribeData;
    return await this.sendMailWithTemplate(emailTemplate, mailData, {
      to: mailTo || 'volodymyr.boichuk@logivations.com',
      subject: subject || 'Event subscription',
      cc: 'Сhristina <christina.kiselova@pixel-robotics.eu>',
      // cc: 'Volodymyr <volodymyr.boichuk@logivations.com>'
    });
  }

  private sendMailWithTemplate(
    templateName: string,
    templateData: { [key: string]: string },
    configParameters: { to: string; subject: string; cc?: string },
  ) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.resolve(`src/mail/templates/${templateName}`),
        templateData,
        (err, template) => {
          console.log('renderFile error: ', err);
          const mailConfig: MessageHeaders = Object.assign(
            {
              from: 'PixelRobotics<info@pixel-robotics.eu>',
              attachment: [{ data: template, alternative: true }],
              headers: {
                'Mime-Version': '1.0',
                'Content-Type': 'text/plain;charset=UTF-8',
              },
              text: null,
            },
            configParameters,
          );
          if (!err && template) {
            this.mailClient.send(mailConfig, (err, message) => {
              if (err) {
                this.logger.error(err.message, err.name, err.stack);
                console.log('mailClient err: ', err);
                reject(err);
              }
              if (message) {
                resolve(message);
              }
            });
          }
        },
      );
    });
  }
}
