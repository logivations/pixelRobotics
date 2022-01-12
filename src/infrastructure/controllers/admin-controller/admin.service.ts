import { Injectable } from "@nestjs/common";
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { parse } from "platform";

@Injectable()
export class AdminService {
    constructor(private readonly environmentConfigService: EnvironmentConfigService){}

    checkPassword(password: string): boolean {
        return password === this.environmentConfigService.getAdminPassword();
    }

    modifyData(items, meta): void {
        return items.map((item, index) => {
            const {name, version} = parse(item.userAgent);
            const {isp} = JSON.parse(item.providerDetail);
            const date = new Date(item.dateTime)
            const parsedData = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}
                ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            return {
                ...item,
                provider: isp || "Provider not found",
                browser: `${name} ${version}`,
                dateTime: parsedData,
                itemNumber: (index + 1) + (parseInt(meta.itemsPerPage) * (meta.currentPage - 1))
            }
        });
    }
}