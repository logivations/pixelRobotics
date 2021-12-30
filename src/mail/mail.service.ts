import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, name: string) {
    console.log('email', email);
    console.log('name', name);
  //   to?: string | Address | Array<string | Address>;
  //   cc?: string | Address | Array<string | Address>;
  //   bcc?: string | Address | Array<string | Address>;
  //   replyTo?: string | Address;
  //   inReplyTo?: string | Address;
  //   from?: string | Address;
  //   subject?: string;
  //   text?: string | Buffer | AttachmentLikeObject;
  //   html?: string | Buffer;
  //   sender?: string | Address;
  //   raw?: string | Buffer;
  //   textEncoding?: TextEncoding;
  //   references?: string | string[];
  //   encoding?: string;
  //   date?: Date | string;
  //   headers?: Headers;
  //   context?: {
  //     [name: string]: any;
  // };
  //   transporterName?: string;
  //   template?: string;
    return await this.mailerService.sendMail({
      to: email,
      from: `${name}<${email}>`, // override default from
      replyTo: email, // override default from
      subject: 'Kontakt | Pixel Robotics',
      template: './hello', // `.hbs` extension is appended automatically
      headers: [
          {key: "Mime-Version", value: "1.0"},
          {key: "Content-Type", value: "text/plain;charset=UTF-8"}
      ],
      context: {
        // ✏️ filling curly brackets with content
        name: name,
      },
    });
  }
}
