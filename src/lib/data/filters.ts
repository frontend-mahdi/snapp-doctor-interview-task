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

function matchesItem(
  item: Item,
  filters: ItemFilters,
  query: string,
  normalizedName = item.name.toLowerCase(),
): boolean {
  if (query && !normalizedName.includes(query)) return false;

  if (filters.category !== "all" && item.category !== filters.category) {
    return false;
  }

  if (item.price < filters.minPrice || item.price > filters.maxPrice) {
    return false;
  }

  if (filters.status !== "all" && item.status !== filters.status) {
    return false;
  }

  return true;
}

export function filterItems(
  items: readonly Item[],
  filters: ItemFilters,
): Item[] {
  const query = filters.query.trim().toLowerCase();

  if (filters.minPrice > filters.maxPrice) return [];

  return items.filter((item) => matchesItem(item, filters, query));
}

export function filterItemIndices(
  items: readonly Item[],
  filters: ItemFilters,
  normalizedNames?: readonly string[],
): Uint32Array {
  if (filters.minPrice > filters.maxPrice) {
    return new Uint32Array(0);
  }

  const query = filters.query.trim().toLowerCase();
  const indices = new Uint32Array(items.length);
  let count = 0;

  for (let index = 0; index < items.length; index++) {
    if (matchesItem(items[index]!, filters, query, normalizedNames?.[index])) {
      indices[count++] = index;
    }
  }

  return indices.slice(0, count);
}
