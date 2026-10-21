
import type { Item } from "./item";

export const DEFAULT_ITEM_COUNT = 100_000;
export const DEFAULT_SEED = 42;

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Beauty",
  "Toys",
  "Food",
] as const;

const ADJECTIVES = [
  "Classic",
  "Premium",
  "Modern",
  "Compact",
  "Smart",
  "Essential",
  "Advanced",
  "Portable",
  "Elegant",
  "Durable",
  "Lightweight",
  "Professional",
] as const;

const NOUNS = [
  "Laptop",
  "Phone",
  "Chair",
  "Watch",
  "Camera",
  "Bottle",
  "Keyboard",
  "Backpack",
  "Headphones",
  "Lamp",
  "Notebook",
  "Speaker",
  "Monitor",
  "Jacket",
  "Shoes",
  "Desk",
] as const;

/**
 * Creates a deterministic pseudo-random number generator.
 * Returns numbers in the range [0, 1).
 */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  // xorshift32 has an absorbing zero state.
  if (state === 0) {
    state = 0x6d2b79f5;
  }

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;

    return (state >>> 0) / 4_294_967_296;
  };
}

export function generateItems(
  count = DEFAULT_ITEM_COUNT,
  seed = DEFAULT_SEED,
): Item[] {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError(
      "count must be a non-negative safe integer",
    );
  }

  if (!Number.isSafeInteger(seed)) {
    throw new RangeError("seed must be a safe integer");
  }

  const random = createRandom(seed);
  const items = new Array<Item>(count);

  for (let index = 0; index < count; index++) {
    const adjective =
      ADJECTIVES[Math.floor(random() * ADJECTIVES.length)];

    const noun =
      NOUNS[Math.floor(random() * NOUNS.length)];

    const category =
      CATEGORIES[Math.floor(random() * CATEGORIES.length)];

    const price = Math.floor(random() * 9_901) + 100;

    const status =
      random() < 0.7 ? "active" : "inactive";

    items[index] = {
      id: index + 1,
      name: `${adjective} ${noun}`,
      category,
      price,
      status,
    };
  }

  return items;
}
