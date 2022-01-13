import {
    Controller,
    Get,
    Render,
    Post,
    Req,
    Res,
    Body,
    Query,
    DefaultValuePipe,
    ParseIntPipe
} from "@nestjs/common";
import { UserActivityService } from "../../modules/user-activity/user-activity.service";
import { ExceptionsService } from "../../exceptions/exceptions.service";
import { AdminService } from "./admin.service";
import { FastifyReply, FastifyRequest } from "fastify";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService,
                private readonly userActivityService: UserActivityService) {}
    @Get()
    @Render('admin/admin.ejs')
    root(@Req() request: FastifyRequest) {
        return { redirectToStatisticsPageNeeded: request.cookies['isLoggedIn'] }
    }

    @Get('statistics')
    @Render('admin/statistics.ejs')
    async renderPageStatistics(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
        return { redirectToAuthPageNeeded: request.cookies['isLoggedIn'] }
    }

    @Get('numberOfPages')
    async getNumberOfPages() {
        const numOfPages = await this.userActivityService.getNumberOfRow()
        return Math.ceil(numOfPages / 50);
    }

    @Get('userActivity')
    @Render('admin/table.statistic.ejs')
    async getUserActivity(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1) {
        const paginateItems = await this.userActivityService.paginate({limit: 50, page: page})
        const data = this.adminService.modifyData(paginateItems.items, paginateItems.meta);
        return {userActivity: data};
    }

    @Post('checkPassword')
    checkPassword(
          @Body() password,
          @Req() request: FastifyRequest,
          @Res({ passthrough: true }) response: FastifyReply
    ) {
        if (request.cookies['isLoggedIn'] === 'true' || this.adminService.checkPassword(password)) {
            response.setCookie('isLoggedIn', "true", {maxAge: 1800});
            return {data: true};
        } else {
            return {data: false};
        }
    }

    @Get('detailIP')
    @Render('admin/details.modal.ejs')
    async getDetailsIP(@Query('userIP') userIP: string, @Query('userAgent') userAgent: string) {
        const detailedIP = await this.userActivityService.getProviderDetail(userIP);
        return {detailedIP: {...JSON.parse(detailedIP), userAgent}};
    }
}