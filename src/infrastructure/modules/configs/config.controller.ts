import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('api/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get('getConfigs')
  public async getConfigs(): Promise<any> {
    return this.configService.getAll();
  }
}
