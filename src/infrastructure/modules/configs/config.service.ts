import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '../../entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configEntityRepository: Repository<Config>,
  ) {}

  public async getAll(): Promise<any> {
    return await this.configEntityRepository.find().then((configs) =>
      configs.reduce((acc, config) => {
        acc.set(config.configName, config.configValue);
        return acc;
      }, new Map()),
    );
  }
}
