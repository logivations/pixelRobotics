import { Inject, Injectable } from '@nestjs/common';
import MailDataDto from './mail-dto/mail.data.dto';
import { HttpService } from '@nestjs/axios';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';

import * as ejs from 'ejs';
import * as path from 'path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '../infrastructure/logger/logger.service';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '../infrastructure/modules/configs/config.service';

@Injectable()
export class MailService {
  private nodeMailerTransporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly config: EnvironmentConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {
    this.createSMTPClients();
  }

  private createSMTPClients() {
    this.configService.getAll().then((configMap) => {
      const clientConfig = {
        host: configMap.get('MAIL_HOST'),
        user: configMap.get('MAIL_USER'),
        password: configMap.get('MAIL_PASSWORD'),
        port: parseInt(configMap.get('MAIL_PORT'), 10),
        ssl: !!Number(configMap.get('MAIL_SSL')),
      };
      this.nodeMailerTransporter = MailService.createNodeMailerTransporter(clientConfig);
    });
  }

  private static createNodeMailerTransporter({
    user,
    password,
    host,
    port,
    ssl,
  }): Transporter<SMTPTransport.SentMessageInfo> {
    return createTransport(
      {
        host,
        port: parseInt(port, 10),
        secure: ssl,
        auth: { type: 'LOGIN', user, pass: password },
        tls: {
          rejectUnauthorized: false
        },
      },
      {
        from: 'PixelRobotics <info@pixel-robotics.eu>',
        headers: {
          'Mime-Version': '1.0',
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      },
    );
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
      }).toPromise();

    if (checkCaptchaResponse.data.success) {
      const { email, name, iWantToTalkWith, message } = mailData;
      try {
        const resultToServer = await this.sendMailWithTemplate(
          'mailToPixelInfoTemplate.ejs',
          { name, email, message, iWantToTalkWith },
          {
            to: 'info@pixel-robotics.eu',
            subject: 'Kontakt | Pixel Robotics',
            bcc: ['christina.kiselova@pixel-robotics.eu'],
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
        return [resultToServer, resultToClient];
      } catch (err) {
        console.log('error', err);
      }
    }
  }

  public async subscribeToEvent(
    subscribeData: { [key: string]: any },
    lang: string,
  ): Promise<any> {
    const {
      sendMailDetail: { mailTo, subject, emailTemplate },
      mailData,
    } = subscribeData;
    return await this.sendMailWithTemplate(
      emailTemplate,
      { ...mailData, lang },
      {
        to: mailTo || 'sales@pixel-robotics.eu',
        subject: subject || 'Event subscription',
        bcc: ['christina.kiselova@pixel-robotics.eu'],
      },
    );
  }

  private sendMailViaNodeMailer(template, configParameters, resolve, reject) {
    const mailConfig = {
      to: configParameters.to,
      subject: configParameters.subject,
      html: template,
      cc: configParameters.cc,
      bcc: configParameters.bcc,
    };
    this.nodeMailerTransporter.sendMail(mailConfig, (error, info) => {
      console.log('error, info', error, info);
      if (error) {
        console.log('Error occurred:', error.message);
        this.logger.error(error.message, 'Error occurred: ');
        reject(error.message);
      }
      resolve(info);
    });
  }

  private sendMailWithTemplate(
    templateName: string,
    templateData: { [key: string]: string },
    configParameters: {
      to: string;
      subject: string;
      from?: string;
      cc?: string | string[];
      bcc?: string | string[];
    }
  ) {
    const templatesPath = path.resolve(
      process.env.NODE_ENV !== 'local'
        ? `../mail/templates/${templateName}`
        : `src/mail/templates/${templateName}`
    );
    this.logger.log(templatesPath, 'templatesPath');

    return new Promise((resolve, reject) => {
      ejs.renderFile(templatesPath, templateData, async (err, template) => {
        this.logger.log(err ? err : 'NO_ERROR', 'renderFile error');
        console.log('err, template', err, template);
        if (!err && template) {
          await this.sendMailViaNodeMailer(
            template,
            configParameters,
            resolve,
            reject,
          );
        } else {
          resolve(err);
        }
      });
    });
  }
}
