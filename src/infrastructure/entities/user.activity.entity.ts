import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_activity' })
export class UserActivity {
  @Column('uuid', { name: 'ID' })
  id: string;

  @PrimaryColumn('text', { name: 'user_IP', nullable: false })
  userIP: string;

  @PrimaryColumn('text', { name: 'visited_page', nullable: false })
  visitedPage: string;

  @CreateDateColumn({ name: 'date_time', type: 'datetime' })
  dateTime: Date;

  @Column('text', { name: 'cookie_detail', nullable: false })
  cookieDetail: string;

  @PrimaryColumn('text', { name: 'user_agent', nullable: false })
  userAgent: string;

  @Column('int', { name: 'number_of_visits', nullable: false })
  numberOfVisits: number;

  @Column('mediumtext', { name: 'plugins', nullable: false })
  plugins: string;

  @Column('mediumtext', { name: 'resolution', nullable: false })
  resolution: string;

  @PrimaryColumn('text', { name: 'provider_detail', nullable: false })
  providerDetail: string;

  @Column('text', { name: 'referer', nullable: false })
  referer: string;
}
