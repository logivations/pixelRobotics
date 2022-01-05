import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (
        config: EnvironmentConfigService,
      ): Promise<MailerOptions> => {
        return {
          transport: {
            host: config.getMailHost(),
            port: config.getMailPort(),
            secure: false,
            auth: {
              user: config.getMailUser(),
              pass: config.getMailPassword(),
            },
          },
          defaults: {
            from: `"No Reply" <${config.getMailFrom()}>`,
          },
          template: {
            dir: join(__dirname, '../../../src/mail', 'templates'),
            adapter: new EjsAdapter({ inlineCssEnabled: true }),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
