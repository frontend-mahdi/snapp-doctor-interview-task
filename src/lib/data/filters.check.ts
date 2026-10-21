
import assert from "node:assert/strict";
import { DEFAULT_FILTERS, filterItems } from "./filters";
import type { Item } from "./item";

const items: Item[] = [
  {
    id: 1,
    name: "Premium Laptop",
    category: "Electronics",
    price: 1500,
    status: "active",
  },
  {
    id: 2,
    name: "Classic Laptop",
    category: "Electronics",
    price: 500,
    status: "inactive",
  },
  {
    id: 3,
    name: "Modern Chair",
    category: "Home",
    price: 300,
    status: "active",
  },
  {
    id: 4,
    name: "Premium Phone",
    category: "Electronics",
    price: 100,
    status: "active",
  },
];

const run = (overrides: Partial<typeof DEFAULT_FILTERS> = {}) =>
  filterItems(items, {
    ...DEFAULT_FILTERS,
    ...overrides,
  });

assert.deepEqual(
  run({ query: "LAPTOP" }).map((item) => item.id),
  [1, 2],
);

assert.deepEqual(
  run({ query: "  laptop  " }).map((item) => item.id),
  [1, 2],
);

assert.deepEqual(
  run({ category: "Home" }).map((item) => item.id),
  [3],
);

assert.deepEqual(
  run({ minPrice: 500, maxPrice: 1500 }).map((item) => item.id),
  [1, 2],
);

assert.deepEqual(
  run({ status: "active" }).map((item) => item.id),
  [1, 3, 4],
);

assert.deepEqual(
  run({
    query: "laptop",
    category: "Electronics",
    minPrice: 400,
    maxPrice: 600,
    status: "inactive",
  }).map((item) => item.id),
  [2],
);

assert.deepEqual(
  run({ query: "nonexistent" }),
  [],
);

assert.deepEqual(
  run({ minPrice: 900, maxPrice: 200 }),
  [],
);

// Filtering must not mutate the input array.
assert.deepEqual(
  items.map((item) => item.id),
  [1, 2, 3, 4],
);

console.log("All filter checks passed.");
