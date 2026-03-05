import { getRestaurantInfo } from "../restaurant/restaurant.service.js";
import { getAllMenuItems } from "../menuItem/menuItem.service.js";

export async function getMenu(slug: string) {
  //get restaurant info
  const restaurantInfo = await getRestaurantInfo(slug);

  //get menuItems grouped by category
  const menuItems = await getAllMenuItems(slug);

  return { restaurantInfo, menuItems };
}
