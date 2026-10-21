
import { describe, expect, it } from "vitest";
import { filterItems, DEFAULT_FILTERS } from "./filters";
import type { Item } from "./item";

const items: Item[] = [
  {
    id: 1,
    name: "Premium Laptop",
    category: "Electronics",
    price: 1200,
    status: "active",
  },
  {
    id: 2,
    name: "Classic Book",
    category: "Books",
    price: 25,
    status: "inactive",
  },
  {
    id: 3,
    name: "Modern Laptop",
    category: "Electronics",
    price: 900,
    status: "inactive",
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Electronics",
    price: 250,
    status: "active",
  },
];

describe("filterItems", () => {
  it("returns items within the default price range", () => {
    const result = filterItems(items, DEFAULT_FILTERS);

    expect(result.map((item) => item.id)).toEqual([1, 3, 4]);
  });

  it("searches names case-insensitively", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      query: "LAPTOP",
    });

    expect(result.map((item) => item.id)).toEqual([1, 3]);
  });

  it("trims whitespace from the search query", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      query: "  book  ",
      minPrice: 0,
    });

    expect(result.map((item) => item.id)).toEqual([2]);
  });

  it("filters by category", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      category: "Books",
      minPrice: 0,
    });

    expect(result.map((item) => item.id)).toEqual([2]);
  });

  it("includes both price boundaries", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      minPrice: 250,
      maxPrice: 900,
    });

    expect(result.map((item) => item.id)).toEqual([3, 4]);
  });

  it("filters by status", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      status: "inactive",
      minPrice: 0,
    });

    expect(result.map((item) => item.id)).toEqual([2, 3]);
  });

  it("combines multiple filters", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      query: "laptop",
      category: "Electronics",
      minPrice: 1000,
      maxPrice: 1500,
      status: "active",
    });

    expect(result.map((item) => item.id)).toEqual([1]);
  });

  it("returns an empty array when the price range is invalid", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      minPrice: 1000,
      maxPrice: 500,
    });

    expect(result).toEqual([]);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterItems(items, {
      ...DEFAULT_FILTERS,
      query: "nonexistent",
    });

    expect(result).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const original = [...items];

    filterItems(items, {
      ...DEFAULT_FILTERS,
      category: "Books",
    });

    expect(items).toEqual(original);
  });
});
