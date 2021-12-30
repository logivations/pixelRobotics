import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'wp1169253.mailout.server-he.de',
        port: 587,
        secure: false,
        auth: {
          user: 'wp1169253-w2motest',
          pass: '13.test.T.79',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@pixel-robotics.eu>',
      },
      template: {
        dir: join(__dirname, '../../../src/mail', 'templates'),
        adapter: new EjsAdapter({inlineCssEnabled: true}),
        options: {
          strict: true,
        },
      }
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
