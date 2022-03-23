import { Injectable } from '@nestjs/common';
import MailDataDto from './mail-dto/mail.data.dto';
import { HttpService } from '@nestjs/axios';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';
import SubscribeEventDataDto from "./mail-dto/subscribe.event.data.dto";
import { SMTPClient } from 'emailjs';
import SendRegistrationFormDataDto from "./mail-dto/send.registration.form.data.dto";

import * as ejs from 'ejs';
import * as path from "path";

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
      const { email, name, mailTo, message } = mailData;
      try {
        const resultToServer = await this.sendMailWithTemplate(
          'mailToPixelInfoTemplate.ejs',
          { name, email, message },
          'volodymyr.boichuk@logivations.com',
          'Kontakt | Pixel Robotics'
        );
        const resultToClient = await this.sendMailWithTemplate(
          'mailToClientTemplate.ejs',
          { name },
          email,
          'Kontakt | Pixel Robotics'
        );
        return [resultToServer, resultToClient];
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  public async subscribeToEvent(subscribeData: SubscribeEventDataDto): Promise<any> {
    const {name, email, company, phone, comment} = subscribeData;
    return  await this.sendMailWithTemplate(
      'subscribeEventMailTemplateToPX.ejs',
      { name, email, company, phone, comment },
      'volodymyr.boichuk@logivations.com',
      'Event subscription'
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
    mailTo: string,
    subject: string
  ) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.resolve(`src/mail/templates/${templateName}`),
        templateData,
        (err, template) => {
          if (!err && template) {
            this.mailClient.send(
              {
                from: 'PixelRobotics<info@pixelrobotics.eu>',
                to: mailTo,
                subject: subject,
                attachment: [
                  { data: template, alternative: true },
                ],
                headers: {
                  'Mime-Version': '1.0',
                  'Content-Type': 'text/plain;charset=UTF-8',
                },
                text: null
              },
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
