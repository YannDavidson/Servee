import { Controller, Get, Module } from "@nestjs/common";

@Controller()
class AppController {
  @Get("health")
  health() {
    return {
      name: "servee-api",
      status: "ok",
      version: "0.1.0"
    };
  }
}

@Module({ controllers: [AppController] })
export class AppModule {}
