"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  CATEGORIES,
  DEFAULT_ITEM_COUNT,
  generateItems,
} from "@/lib/data/generate-items";
import {
  DEFAULT_FILTERS,
  filterItems,
  type ItemFilters,
} from "@/lib/data/filters";
import VirtualizedList from "@/components/virtualized-list";

export default function Home() {
  const [items] = useState(() => generateItems(DEFAULT_ITEM_COUNT));
  const [filters, setFilters] = useState<ItemFilters>(DEFAULT_FILTERS);

  const deferredFilters = useDeferredValue(filters);

  const isUpdating = filters !== deferredFilters;

  const filteredItems = useMemo(
    () => filterItems(items, deferredFilters),
    [items, deferredFilters],
  );

  function updateFilter<K extends keyof ItemFilters>(
    key: K,
    value: ItemFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters({ ...DEFAULT_FILTERS });
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Search & Filter</h1>
          <p className="mt-2 text-sm text-gray-600">
            Search and filter 100,000 mock products.
          </p>
        </header>

        <section
          aria-label="Search and filters"
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-medium">
                Search by name
              </label>
              <input
                id="search"
                type="search"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="e.g. laptop"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(event) =>
                  updateFilter(
                    "status",
                    event.target.value as ItemFilters["status"],
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="min-price" className="block text-sm font-medium">
                Minimum price
              </label>
              <input
                id="min-price"
                type="number"
                min={0}
                value={filters.minPrice}
                onChange={(event) =>
                  updateFilter("minPrice", Number(event.target.value))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="max-price" className="block text-sm font-medium">
                Maximum price
              </label>
              <input
                id="max-price"
                type="number"
                min={0}
                value={filters.maxPrice}
                onChange={(event) =>
                  updateFilter("maxPrice", Number(event.target.value))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100"
              >
                Reset filters
              </button>
            </div>
          </div>
        </section>

        <section aria-label="Search results" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Results</h2>
            <p
              aria-live="polite"
              className="text-sm text-gray-600"
              aria-busy={isUpdating}
            >
              {isUpdating
                ? "Updating results..."
                : `${filteredItems.length.toLocaleString()} matching items`}
            </p>
          </div>

          <VirtualizedList items={filteredItems} />
        </section>
      </div>
    </main>
  );
}
