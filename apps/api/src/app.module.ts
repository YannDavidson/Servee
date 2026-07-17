import { Controller, Get, Module } from "@nestjs/common";
import { GuestController } from "./guest.controller";
import { GuestService } from "./guest.service";
import { PrismaService } from "./prisma.service";

@Controller()
class AppController {
  @Get("health")
  health() {
    return { name: "servee-api", status: "ok", version: "0.1.0" };
  }
}

@Module({
  controllers: [AppController, GuestController],
  providers: [PrismaService, GuestService]
})
export class AppModule {}
