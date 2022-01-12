import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UserActivityModule } from "../../modules/user-activity/user-activity.module";
import { EnvironmentConfigModule } from "../../config/environment-config/environment-config.module";
import { ExceptionsModule } from "../../exceptions/exceptions.module";

@Module({
    imports: [UserActivityModule, EnvironmentConfigModule, ExceptionsModule],
    controllers: [AdminController],
    providers: [AdminService]
})

export class AdminModule {}