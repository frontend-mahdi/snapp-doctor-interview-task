
import {
  DEFAULT_ITEM_COUNT,
  DEFAULT_SEED,
  generateItems,
} from "./generate-items";

const start = performance.now();
const items = generateItems();
const generationMs = performance.now() - start;

if (items.length !== DEFAULT_ITEM_COUNT) {
  throw new Error("Incorrect item count");
}

if (items[0]?.id !== 1) {
  throw new Error("Incorrect first ID");
}

if (items.at(-1)?.id !== DEFAULT_ITEM_COUNT) {
  throw new Error("Incorrect last ID");
}

const repeated = generateItems(100, DEFAULT_SEED);
const repeatedAgain = generateItems(100, DEFAULT_SEED);

if (JSON.stringify(repeated) !== JSON.stringify(repeatedAgain)) {
  throw new Error("Generation is not deterministic");
}

const ids = new Set(items.map((item) => item.id));

if (ids.size !== DEFAULT_ITEM_COUNT) {
  throw new Error("IDs are not unique");
}

console.log({
  count: items.length,
  generationMs: Number(generationMs.toFixed(2)),
  firstItem: items[0],
  lastItem: items.at(-1),
  uniqueIds: ids.size,
});
