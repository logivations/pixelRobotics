import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'config' })
export class Config {
  @PrimaryColumn('text', { name: 'config_name' })
  configName: string;

  @Column('text', { name: 'config_value' })
  configValue: string;
}
