import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_activity' })
@Index(['userIP', 'browserDetail'])
export class UserActivity {
  @PrimaryGeneratedColumn('rowid', { name: 'ID' })
  id: number;

  @Column('text', { name: 'user_IP', nullable: false })
  userIP: string;

  @Column('text', { name: 'visited_page', nullable: false })
  visitedPage: string;

  @CreateDateColumn({ name: 'date_time', type: 'datetime' })
  dateTime: string;

  @Column('mediumtext', { name: 'cookie_detail', nullable: false })
  cookieDetail: string;

  @Column('text', { name: 'browser', nullable: false })
  browser: string;

  @Column('mediumtext', { name: 'browser_detail', nullable: false })
  browserDetail: string;

  @Column('mediumtext', { name: 'user_info', nullable: false })
  userInfo: string;

  @Column('mediumtext', { name: 'provider_detail', nullable: false })
  providerDetail: string;

  @Column('text', { name: 'referer', nullable: false })
  referer: string;
}
