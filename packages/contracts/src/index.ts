export type Money = { amount: number; currency: "USD" | "EUR" | "GBP" };

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: Money;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
};

export type OrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type TableSession = {
  id: string;
  restaurantId: string;
  locationId: string;
  tableId: string;
  openedAt: string;
};
