
# Snapp Doctor — Search & Filter

A client-side search and filtering application built with Next.js, React, and TypeScript. The application works with 100,000 mock items and uses list virtualization to reduce the number of DOM elements rendered at once.

## Features

- Case-insensitive search by item name
- Combined category, price range, and status filters
- Reset filters
- Matching item count
- Virtualized results with TanStack Virtual
- Deferred result updates using React's `useDeferredValue`
- Deterministic mock data generation
- Unit tests for filtering logic

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Virtual
- Vitest

## Getting Started

### Requirements

- Node.js 24
- npm

### Installation

```bash
npm ci
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Tests

```bash
npm test
npx tsc --noEmit
```

## Performance

### Benchmark Environment

- Runtime: Node.js 24
- Dataset sizes: 100,000 and 1,000,000 items
- Runs: 7 measurements after one warm-up run
- Statistic: median filter duration
- Filtering: synchronous, executed in Node.js
- Query: `laptop`
- Category: `Electronics`

### Baseline Results

| Dataset Size | Median | Minimum | Maximum | Matching Items |
|---:|---:|---:|---:|---:|
| 100,000 | 4.70 ms | 4.35 ms | 4.97 ms | 739 |
| 1,000,000 | 48.66 ms | 43.86 ms | 70.26 ms | 7,749 |

These measurements represent filter execution time in Node.js. They do not measure browser input latency, rendering time, or the full interaction lifecycle.

Results depend on the runtime, hardware, and system load. They should be treated as a local baseline rather than universal performance guarantees.

### Current Limitations

- Filtering executes on the main thread in the browser.
- `useDeferredValue` prioritizes urgent UI updates but does not move computation off the main thread.
- Virtualization reduces DOM work but does not eliminate the cost of filtering the dataset.
- The benchmark measures filtering duration, not total memory consumption.

### Optimization Plan

1. Move filtering into a Web Worker.
2. Ignore stale results when users change filters rapidly.
3. Compare filtering duration and browser responsiveness before and after the change.
4. Inspect long tasks, DOM size, and memory usage in Chrome DevTools.

## AI Usage

AI assistance was used to help with implementation planning, debugging, test design, and performance optimization. The implementation and results should be reviewed and validated against the task requirements.

## Project Status

The current implementation provides client-side filtering, virtualized results, and unit tests. Web Worker-based filtering and comparative browser performance measurements are planned next.
