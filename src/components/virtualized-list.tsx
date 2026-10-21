
"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Item } from "@/lib/data/item";

type VirtualizedListProps = {
  items: readonly Item[];
  indices: Uint32Array;
};

const ROW_HEIGHT = 49;
const OVERSCAN = 8;

export default function VirtualizedList({
  items,
  indices,
}: VirtualizedListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: indices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    getItemKey: (index) => items[indices[index]!]!.id,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-[60px_minmax(0,1fr)_minmax(100px,0.7fr)_100px_100px] gap-3 border-b bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-600">
        <span>ID</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Status</span>
      </div>

      {indices.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-gray-500">
          No matching items found.
        </p>
      ) : (
        <div
          ref={parentRef}
          role="list"
          aria-label="Filtered items"
          className="h-[490px] overflow-auto"
        >
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualItems.map((virtualItem) => {
              const item = items[indices[virtualItem.index]!]!;

              return (
                <div
                  key={virtualItem.key}
                  role="listitem"
                  aria-posinset={virtualItem.index + 1}
                  aria-setsize={indices.length}
                  className="absolute left-0 top-0 grid w-full grid-cols-[60px_minmax(0,1fr)_minmax(100px,0.7fr)_100px_100px] items-center gap-3 border-b border-gray-100 px-4 text-sm"
                  style={{
                    height: ROW_HEIGHT,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <span className="text-gray-500">{item.id}</span>
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="truncate">{item.category}</span>
                  <span>{item.price.toLocaleString()}</span>
                  <span
                    className={
                      item.status === "active"
                        ? "font-medium text-green-700"
                        : "font-medium text-gray-500"
                    }
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
