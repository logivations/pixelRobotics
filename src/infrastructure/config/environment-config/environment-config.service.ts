import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from '../../../domain/config/environment.interface';

@Injectable()
export class EnvironmentConfigService implements EnvironmentConfig {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
  }

  getSecretCaptchaKey(): string {
    return this.configService.get<string>('SECRET_CAPTCHA_KEY');
  }

  getMailHost(): string {
    return this.configService.get<string>('MAIL_HOST');
  }

  getMailPort(): number {
    return this.configService.get<number>('MAIL_PORT');
  }

  getMailUser(): string {
    return this.configService.get<string>('MAIL_USER');
  }

  getMailPassword(): string {
    return this.configService.get<string>('MAIL_PASSWORD');
  }

  getMailFrom(): string {
    return this.configService.get<string>('MAIL_FROM');
  }

  getAdminPassword(): string {
    return this.configService.get<string>('ADMIN_PASSWORD');
  }
}
