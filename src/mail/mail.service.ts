import { Injectable } from '@nestjs/common';
import MailDataDto from './mail-dto/mail.data.dto';
import { HttpService } from '@nestjs/axios';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';
import SubscribeEventDataDto from "./mail-dto/subscribe.event.data.dto";
import { SMTPClient } from 'emailjs';
import SendRegistrationFormDataDto from "./mail-dto/send.registration.form.data.dto";

import * as ejs from 'ejs';
import * as path from "path";
import { MessageHeaders } from "emailjs/smtp/message";

@Injectable()
export class MailService {
  private mailClient: SMTPClient;
  constructor(
    private readonly httpService: HttpService,
    private readonly config: EnvironmentConfigService,
  ) {
    this.mailClient = new SMTPClient({
      user: this.config.getMailUser(),
      password: this.config.getMailPassword(),
      host: this.config.getMailHost(),
      port: this.config.getMailPort(),
      ssl: false,
      logger: (...args) => {
        console.log("args", args);
      }
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
            // cc: 'Сhristina <christina.kiselova@pixel-robotics.eu>'
            cc: 'Volodymyr <volodymyr.boichuk@logivations.com>'
          },

        );
        const resultToClient = await this.sendMailWithTemplate(
          'mailToClientTemplate.ejs',
          { name },
          {
            to: email,
            subject: 'Kontakt | Pixel Robotics',
          }
        );
        return [resultToServer, resultToClient];
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  public async subscribeToEvent(subscribeData: SubscribeEventDataDto): Promise<any> {
    const {name, email, company, phone, comment} = subscribeData;
    return await this.sendMailWithTemplate(
      'subscribeEventMailTemplateToPX.ejs',
      { name, email, company, phone, comment },
      {
        to: 'volodymyr.boichuk@logivations.com',
        subject: 'Event subscription',
        // cc: 'Сhristina <christina.kiselova@pixel-robotics.eu>'
        cc: 'Volodymyr <volodymyr.boichuk@logivations.com>'
      }
    );
  }

  public async sendRegistrationForm(registrationData: SendRegistrationFormDataDto): Promise<any> {
    // const {name, company, jobTitle, email, phone, supplyChainEngineering, advancedSlotting, optimizedTourBuilding,
    //   capacityAndWorkforce, cubing3D, digitalTwinForPlanning, digitalTwinForOptimization, measureAndCountProducts,
    //   managementOptimizationAndControl, masterDataAcquisition, trackingForAllTypes, automaticBooking, intelligentFleet,
    //   autonomousFloor, scfYes, scfNo, scfText, onTuesday, onWednesday, onThursday, commentForm} = registrationData;
    // return this.mailerService.sendMail({
    //   to: 'volodymyr.boichuk@logivations.com',
    //   from: email,
    //   subject: 'REGISTRATION FORM',
    //   template: 'registrationFormMailTemplateToPX',
    //   headers: [
    //     { key: 'Mime-Version', value: '1.0' },
    //     { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
    //   ],
    //   context: { name, company, jobTitle, email, phone, supplyChainEngineering, advancedSlotting, optimizedTourBuilding,
    //     capacityAndWorkforce, cubing3D, digitalTwinForPlanning, digitalTwinForOptimization, measureAndCountProducts,
    //     managementOptimizationAndControl, masterDataAcquisition, trackingForAllTypes, automaticBooking, intelligentFleet,
    //     autonomousFloor, scfYes, scfNo, scfText, onTuesday, onWednesday, onThursday, commentForm },
    // });
  }

  private sendMailWithTemplate(
    templateName: string,
    templateData: {[key: string]: string},
    configParameters: {to: string, subject: string, cc?: string},
  ) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.resolve(`src/mail/templates/${templateName}`),
        templateData,
        (err, template) => {
          const mailConfig: MessageHeaders = Object.assign({
            from: 'PixelRobotics<info@pixel-robotics.eu>',
            attachment: [{ data: template, alternative: true }],
            headers: {
              'Mime-Version': '1.0',
              'Content-Type': 'text/plain;charset=UTF-8',
            },
            text: null
          }, configParameters);
          if (!err && template) {
            this.mailClient.send(
              mailConfig,
              (err, message) => {
                if (err) { reject(err); }
                if (message) { resolve(message); }
              }
            )
          }
        });
    })
  }
}
