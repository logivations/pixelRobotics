import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../infrastructure/config/environment-config/environment-config.service';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { HttpModule } from '@nestjs/axios';

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
            host: 'test.pixel-robotics.com',
            port: 465,
            secure: true,
            auth: {
              type: "LOGIN",
              user: '_mainaccount@test.pixel-robotics.com',
              pass: 'KEt9GVbfm9TU7i3m4eYv',
            },
          },
          defaults: {
            from: `"No Reply <PixelRobotics>"`,
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
    HttpModule,
    EnvironmentConfigModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
