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
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailService {
  private mailClient: SMTPClient;
  private nodeMailerTransporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(
    private readonly httpService: HttpService,
    private readonly config: EnvironmentConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {
    this.mailClient = MailService.createSMTPClient();
    this.nodeMailerTransporter = MailService.createNodeMailerTransporter();
  }

  private static createSMTPClient(): SMTPClient {
    return new SMTPClient({
      user: 'info@test.pixel-robotics.com',
      password: 'k8%9G7cDYHK4RAgp',
      host: 'mail.test.pixel-robotics.com',
      port: 587,
      ssl: false,
      logger: (...args) => {
        console.log('args', args);
      },
    });
  }

  private static createNodeMailerTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
    return nodemailer.createTransport(
      {
        host: "mail.test.pixel-robotics.com",
        port: 587,
        secure: false,
        auth: {
          type: 'LOGIN',
          user: 'info@test.pixel-robotics.com',
          pass: 'k8%9G7cDYHK4RAgp'
        },
        transactionLog: true // include SMTP traffic in the logs
      },
      {
        from: 'PixelRobotics <info@pixel-robotics.eu>',
        headers: {
          'Mime-Version': '1.0',
          'Content-Type': 'text/plain;charset=UTF-8',
        }
      }
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
            cc: ['christina.kiselova@pixel-robotics.eu'],
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

  public async subscribeToEvent(subscribeData: {
    [key: string]: any;
  }, lang: string): Promise<any> {
    const {
      sendMailDetail: { mailTo, subject, emailTemplate },
      mailData,
    } = subscribeData;
    return await this.sendMailWithTemplate(emailTemplate, {...mailData, lang}, {
      to: mailTo || 'volodymyr.boichuk@logivations.com',
      subject: subject || 'Event subscription',
      cc: ['volodymyr.boichuk@logivations.com', 'christina.kiselova@pixel-robotics.eu'],
      bcc: ['volodymyr.boichuk@logivations.com', 'christina.kiselova@pixel-robotics.eu'],
    });
  }

  private sendMailViaNodeMailer(template, configParameters, resolve, reject) {
    const mailConfig = {
      to: configParameters.to,
      subject: configParameters.subject,
      html: template,
    };
    this.nodeMailerTransporter.sendMail(mailConfig, (error, info) => {
      if (error) {
        console.log('Error occurred');
        console.log(error.message);
        reject(error.message);
      }

      console.log('Message sent successfully!');
      console.log(nodemailer.getTestMessageUrl(info));

      // only needed when using pooled connections
      // this.nodeMailerTransporter.close();
      resolve(nodemailer.getTestMessageUrl(info));
    });
  }

  private sendMailViaEmailJs(template, configParameters, resolve, reject) {
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
    this.mailClient.send(mailConfig, (error, message) => {
      if (error) {
        this.logger.error(error.message, error.name, error.stack);
        reject(error);
      }
      if (message) {
        resolve(message);
      }
    });
  }

  private sendMailWithTemplate(
    templateName: string,
    templateData: { [key: string]: string },
    configParameters: { to: string; subject: string; cc?: string | string[], bcc?: string | string[] },
  ) {
    const templatesPath = process.env.NODE_ENV !== 'local'
      ? path.resolve(`../mail/templates/${templateName}`)
      : path.resolve(`src/mail/templates/${templateName}`);
    this.logger.log(templatesPath, 'templatesPath');

    return new Promise((resolve, reject) => {
      ejs.renderFile(
        templatesPath,
        templateData,
        (err, template) => {
          this.logger.log(err ? err : 'NO_ERROR', 'renderFile error');
          if (!err && template) {
            this.sendMailViaEmailJs(template, configParameters, resolve, reject);
            this.sendMailViaNodeMailer(template, configParameters, resolve, reject);
          } else {
            reject(err);
          }
        },
      );
    });
  }
}
