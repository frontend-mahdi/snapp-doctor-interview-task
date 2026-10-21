
import { performance } from "node:perf_hooks";
import { generateItems } from "./generate-items";
import { filterItems, DEFAULT_FILTERS } from "./filters";

const COUNTS = [100_000, 1_000_000];
const RUNS = 7;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

for (const count of COUNTS) {
  console.log(`\nBenchmark: ${count.toLocaleString()} items`);

  const items = generateItems(count);

  const filters = {
    ...DEFAULT_FILTERS,
    query: "laptop",
    category: "Electronics",
  };

  // Warm-up: reduce the impact of initial runtime overhead.
  filterItems(items, filters);

  const durations: number[] = [];
  let matchingCount = 0;

  for (let run = 0; run < RUNS; run++) {
    const start = performance.now();
    const result = filterItems(items, filters);
    durations.push(performance.now() - start);
    matchingCount = result.length;
  }

  console.log({
    items: count,
    runs: RUNS,
    medianMs: Number(median(durations).toFixed(2)),
    minMs: Number(Math.min(...durations).toFixed(2)),
    maxMs: Number(Math.max(...durations).toFixed(2)),
    matchingCount,
  });
}
