# Snapp Doctor — Search & Filter

A client-side search and filtering application built with Next.js, React, and TypeScript. The application processes 100,000 mock items by default and uses a Web Worker for filtering and TanStack Virtual to minimize DOM rendering.

## Features

- Case-insensitive search by item name
- Combined category, price range, and status filters
- Reset filters and display the matching item count
- Web Worker-based filtering to keep expensive computation off the main thread
- Stale-response protection using request IDs
- Transferable `Uint32Array` indices to reduce result-transfer overhead
- Cached lowercase item names to avoid repeated string normalization
- Virtualized results with TanStack Virtual
- Deterministic mock data generation
- Unit tests for filtering logic

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Virtual
- Web Workers
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
npm run build
```

## Performance

### Implementation

Filtering runs in a dedicated Web Worker rather than on the main thread.

The Worker caches normalized item names during initialization and returns matching item indices as a transferable `Uint32Array`. This avoids transferring complete item objects back to the main thread for every filter update.

The main thread maps the matching indices to the original items, while TanStack Virtual renders only the visible portion of the result list and a small overscan region.

Request IDs prevent outdated Worker responses from replacing the results of newer filter requests.

### Node.js Baseline

The original synchronous filtering implementation was benchmarked separately in Node.js.

**Benchmark environment**

- Runtime: Node.js 24
- Dataset sizes: 100,000 and 1,000,000 items
- Runs: 7 measurements after one warm-up run
- Statistic: median filter duration
- Query: `laptop`
- Category: `Electronics`

| Dataset size | Median | Minimum | Maximum | Matching items |
|---:|---:|---:|---:|---:|
| 100,000 | 4.70 ms | 4.35 ms | 4.97 ms | 739 |
| 1,000,000 | 48.66 ms | 43.86 ms | 70.26 ms | 7,749 |

These measurements represent synchronous filter execution in Node.js. They do not measure browser input latency, Worker communication, rendering time, or total memory consumption.

### Browser Web Worker Stress Test

The following measurements were collected locally in the browser after caching normalized item names and switching to transferable indices. The stress-test dataset contained 1,000,000 items.

| Scenario | Matching items | Worker filtering | Round trip |
|---|---:|---:|---:|
| Search: `laptop` | 62,160 | 25.3–31.7 ms | 25.6–31.8 ms |
| Search: `a` | 906,054 | 27.6 ms | 28.2 ms |
| Reset / all items | 1,000,000 | 12.7–13.6 ms | 15.5–25.4 ms |

The `laptop` measurements had a median Worker filtering time of approximately 28.2 ms, compared with the earlier browser measurement of approximately 51.3 ms before caching normalized names. This represents an observed reduction of approximately 45% for that workload.

`workerFilterMs` measures filtering inside the Worker. `roundTripMs` measures elapsed time from sending a filter request until its response is received. Neither metric includes all subsequent React rendering work.

These are local stress-test measurements, not universal performance guarantees. Results depend on the browser, hardware, system load, query, and number of matching items. The Node.js baseline and browser measurements use different environments and should not be compared as equivalent benchmarks.

### Performance Considerations

- Web Workers move filtering computation off the main thread but do not eliminate the computation itself.
- Transferable index buffers reduce the cost of transferring matching results, but mapping indices to items and rendering results still have costs.
- Virtualization reduces the number of DOM elements rendered at once; it does not eliminate filtering or result-mapping costs.
- Caching normalized names reduces repeated string conversions at the cost of additional memory.
- The current benchmark measures execution and response timings, not total application memory usage or complete interaction latency.

## AI Usage

AI assistance was used for implementation planning, debugging, test design, and performance optimization. The implementation was tested locally, and the reported measurements were collected during browser and Node.js testing.

## Project Status

The application implements client-side search and combined filtering, Web Worker execution, stale-response protection, transferable result indices, cached normalized names, virtualized rendering, and unit tests.

The default dataset size is 100,000 items. A dataset of 1,000,000 items was also used for local performance stress testing.
