import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GuestService } from "./guest.service";
import { OpenSessionDto, SubmitOrderDto } from "./guest.dto";

@Controller("guest")
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post("sessions")
  openSession(@Body() input: OpenSessionDto) {
    return this.guestService.openSession(input.qrToken);
  }

  @Get("restaurants/:restaurantSlug/locations/:locationId/menu")
  getMenu(@Param("restaurantSlug") restaurantSlug: string, @Param("locationId") locationId: string) {
    return this.guestService.getMenu(restaurantSlug, locationId);
  }

  @Post("orders")
  submitOrder(@Body() input: SubmitOrderDto) {
    return this.guestService.submitOrder(input);
  }

  @Get("orders/:reference")
  getOrder(@Param("reference") reference: string) {
    return this.guestService.getOrder(reference);
  }
}
