"use client";

import { useEffect, useRef, useState } from "react";
import type { ItemFilters } from "@/lib/data/filters";
import type { Item } from "@/lib/data/item";

type WorkerResponse =
  | {
      type: "READY";
    }
  | {
      type: "FILTER_RESULT";
      requestId: number;
      items: Item[];
    };

export function useWorkerFilter(items: Item[], filters: ItemFilters) {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/filter.worker.ts", import.meta.url),
    );

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;

      if (message.type === "READY") {
        setIsReady(true);
        return;
      }

      if (message.requestId !== requestIdRef.current) {
        return;
      }

      setFilteredItems(message.items);
      setIsUpdating(false);
    };

    worker.onerror = (event) => {
      console.error("Filter worker failed:", event.message);
      setIsUpdating(false);
    };

    worker.postMessage({
      type: "INIT",
      items,
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [items]);

  useEffect(() => {
    const worker = workerRef.current;

    if (!worker || !isReady) {
      return;
    }

    const requestId = ++requestIdRef.current;

    setIsUpdating(true);

    worker.postMessage({
      type: "FILTER",
      requestId,
      filters,
    });
  }, [filters, isReady]);

  return {
    filteredItems,
    isUpdating,
  };
}
