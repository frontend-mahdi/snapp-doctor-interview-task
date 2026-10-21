
import { filterItems } from "@/lib/data/filters";
import type { ItemFilters } from "@/lib/data/filters";
import type { Item } from "@/lib/data/item";

type WorkerRequest =
  | {
      type: "INIT";
      items: Item[];
    }
  | {
      type: "FILTER";
      requestId: number;
      filters: ItemFilters;
    };

type WorkerResponse =
  | {
      type: "READY";
    }
  | {
      type: "FILTER_RESULT";
      requestId: number;
      items: Item[];
    };

let allItems: Item[] = [];

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;

  if (message.type === "INIT") {
    allItems = message.items;

    const response: WorkerResponse = {
      type: "READY",
    };

    self.postMessage(response);
    return;
  }

  if (message.type === "FILTER") {
    const filtered = filterItems(allItems, message.filters);

    const response: WorkerResponse = {
      type: "FILTER_RESULT",
      requestId: message.requestId,
      items: filtered,
    };

    self.postMessage(response);
  }
};
