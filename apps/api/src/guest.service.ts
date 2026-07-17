import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { PrismaService } from "./prisma.service";
import type { SubmitOrderDto } from "./guest.dto";

const SESSION_HOURS = 8;

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) {}

  async openSession(qrToken: string) {
    const table = await this.prisma.diningTable.findUnique({
      where: { qrToken },
      include: { location: { include: { restaurant: true } } }
    });
    if (!table) throw new NotFoundException({ code: "INVALID_QR_TOKEN", message: "This table link is invalid." });

    const now = new Date();
    let session = await this.prisma.tableSession.findFirst({
      where: { tableId: table.id, closedAt: null, expiresAt: { gt: now } },
      orderBy: { openedAt: "desc" }
    });
    if (!session) {
      session = await this.prisma.tableSession.create({
        data: { tableId: table.id, expiresAt: new Date(now.getTime() + SESSION_HOURS * 60 * 60 * 1000) }
      });
    }

    return {
      sessionId: session.id,
      expiresAt: session.expiresAt,
      restaurant: { id: table.location.restaurant.id, name: table.location.restaurant.name, slug: table.location.restaurant.slug },
      location: { id: table.location.id, name: table.location.name },
      table: { id: table.id, label: table.label }
    };
  }

  async getMenu(restaurantSlug: string, locationId: string) {
    const location = await this.prisma.location.findFirst({
      where: { id: locationId, restaurant: { slug: restaurantSlug } },
      include: { restaurant: true, menuItems: { orderBy: [{ category: "asc" }, { name: "asc" }] } }
    });
    if (!location) throw new NotFoundException({ code: "MENU_NOT_FOUND", message: "Restaurant or location not found." });
    return {
      restaurant: { id: location.restaurant.id, name: location.restaurant.name, slug: location.restaurant.slug },
      location: { id: location.id, name: location.name },
      items: location.menuItems.map((item) => ({
        id: item.id, name: item.name, description: item.description, category: item.category,
        priceCents: item.priceCents, imageUrl: item.imageUrl, isAvailable: item.isAvailable
      }))
    };
  }

  async submitOrder(input: SubmitOrderDto) {
    const session = await this.prisma.tableSession.findUnique({
      where: { id: input.sessionId }, include: { table: true }
    });
    if (!session || session.closedAt || session.expiresAt <= new Date()) {
      throw new BadRequestException({ code: "SESSION_INVALID", message: "The table session is closed or expired." });
    }

    const ids = [...new Set(input.items.map((item) => item.menuItemId))];
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: ids }, locationId: session.table.locationId }
    });
    const menuById = new Map(menuItems.map((item) => [item.id, item]));
    const normalized = input.items.map((requested) => {
      const menuItem = menuById.get(requested.menuItemId);
      if (!menuItem) throw new BadRequestException({ code: "MENU_ITEM_INVALID", message: "One or more menu items are invalid." });
      if (!menuItem.isAvailable) throw new BadRequestException({ code: "MENU_ITEM_UNAVAILABLE", message: `${menuItem.name} is unavailable.` });
      return { requested, menuItem };
    });
    const subtotalCents = normalized.reduce((sum, row) => sum + row.menuItem.priceCents * row.requested.quantity, 0);
    const publicReference = `SV-${randomBytes(4).toString("hex").toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          publicReference,
          locationId: session.table.locationId,
          tableSessionId: session.id,
          status: OrderStatus.SUBMITTED,
          subtotalCents,
          submittedAt: new Date(),
          items: { create: normalized.map(({ requested, menuItem }) => ({
            menuItemId: menuItem.id,
            itemName: menuItem.name,
            quantity: requested.quantity,
            unitPriceCents: menuItem.priceCents,
            notes: requested.notes?.trim() || null
          })) },
          events: { create: { fromStatus: null, toStatus: OrderStatus.SUBMITTED, actorType: "GUEST" } }
        },
        include: { items: true }
      });
      return created;
    });

    return this.toGuestOrder(order);
  }

  async getOrder(reference: string) {
    const order = await this.prisma.order.findUnique({ where: { publicReference: reference }, include: { items: true } });
    if (!order) throw new NotFoundException({ code: "ORDER_NOT_FOUND", message: "Order not found." });
    return this.toGuestOrder(order);
  }

  private toGuestOrder(order: { publicReference: string; status: OrderStatus; subtotalCents: number; submittedAt: Date | null; items: Array<{ itemName: string; quantity: number; unitPriceCents: number; notes: string | null }> }) {
    return {
      reference: order.publicReference,
      status: order.status,
      subtotalCents: order.subtotalCents,
      submittedAt: order.submittedAt,
      items: order.items.map((item) => ({ name: item.itemName, quantity: item.quantity, unitPriceCents: item.unitPriceCents, notes: item.notes }))
    };
  }
}
