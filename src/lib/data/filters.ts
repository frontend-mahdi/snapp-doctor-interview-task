
import type { Item, ItemStatus } from "./item";

export type ItemFilters = {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  status: "all" | ItemStatus;
};

export const DEFAULT_FILTERS: ItemFilters = {
  query: "",
  category: "all",
  minPrice: 100,
  maxPrice: 10_000,
  status: "all",
};

export function filterItems(
  items: readonly Item[],
  filters: ItemFilters,
): Item[] {
  const query = filters.query.trim().toLowerCase();

  if (filters.minPrice > filters.maxPrice) {
    return [];
  }

  return items.filter((item) => {
    if (
      query &&
      !item.name.toLowerCase().includes(query)
    ) {
      return false;
    }

    if (
      filters.category !== "all" &&
      item.category !== filters.category
    ) {
      return false;
    }

    if (
      item.price < filters.minPrice ||
      item.price > filters.maxPrice
    ) {
      return false;
    }

    if (
      filters.status !== "all" &&
      item.status !== filters.status
    ) {
      return false;
    }

    return true;
  });
}
