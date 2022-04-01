import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { parse } from 'platform';

@Injectable()
export class AdminService {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}

  checkPassword(password: string): boolean {
    return password === this.environmentConfigService.getAdminPassword();
  }

  modifyData(items, meta): void {
    const padZero2 = (d) => {
      let s = d.toString();
      if (s.length < 2) {
        s = '0' + s;
      }
      return s;
    };
    return items
      .sort((itemA, itemB) => ((new Date(itemB.dateTime)).getTime() - (new Date(itemA.dateTime)).getTime()))
      .map((item, index) => {
        const { name, version } = parse(item.userAgent);
        const { isp } = JSON.parse(item.providerDetail);
        const date = new Date(item.dateTime);
        const parsedData = `${date.getFullYear()}-${padZero2(date.getMonth() + 1)}-${padZero2(date.getDate())}
                  ${padZero2(date.getHours())}:${padZero2(date.getMinutes())}:${padZero2(date.getSeconds())}`;
        return {
          ...item,
          provider: isp || 'Provider not found',
          browser: `${name} ${version}`,
          dateTime: parsedData,
          itemNumber:
            index + 1 + parseInt(meta.itemsPerPage) * (meta.currentPage - 1),
        };
      });
  }
}
