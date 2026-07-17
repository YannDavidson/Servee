import { notFound } from "next/navigation";
import { MenuExperience } from "../../../../../components/menu-experience";
import { getRestaurantMenu } from "../../../../../lib/menu-fixtures";

type PageProps = {
  params: Promise<{ restaurantSlug: string; tableNumber: string }>;
};

export default async function RestaurantTablePage({ params }: PageProps) {
  const { restaurantSlug, tableNumber } = await params;
  const menu = getRestaurantMenu(restaurantSlug);

  if (!menu || !tableNumber.trim()) {
    notFound();
  }

  return <MenuExperience menu={menu} tableNumber={tableNumber} />;
}
