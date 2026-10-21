
import { filterItemIndices } from "@/lib/data/filters";
import type { ItemFilters } from "@/lib/data/filters";
import type { Item } from "@/lib/data/item";

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (
    message: unknown,
    options?: StructuredSerializeOptions,
  ) => void;
};

type WorkerRequest =
  | { type: "INIT"; items: Item[] }
  | { type: "FILTER"; requestId: number; filters: ItemFilters };

type WorkerResponse =
  | { type: "READY" }
  | {
      type: "FILTER_RESULT";
      requestId: number;
      indices: Uint32Array;
      workerFilterMs: number;
    };

let allItems: Item[] = [];

workerScope.onmessage = (event: MessageEvent<WorkerRequest>) => {
      const message = event.data;

  if (message.type === "INIT") {
    allItems = message.items;
    const response: WorkerResponse = { type: "READY" };
    workerScope.postMessage(response);
    return;
  }

  if (message.type === "FILTER") {
    const start = performance.now();
    const indices = filterItemIndices(allItems, message.filters);
    const workerFilterMs = performance.now() - start;

    const buffer = indices.buffer;

    if (!(buffer instanceof ArrayBuffer)) {
      throw new Error("Expected indices to use an ArrayBuffer");
    }

    // Create a view over the same buffer; no additional data copy.
    const transferableIndices = new Uint32Array(
      buffer,
      indices.byteOffset,
      indices.length,
    );

    const response: WorkerResponse = {
      type: "FILTER_RESULT",
      requestId: message.requestId,
      indices: transferableIndices,
      workerFilterMs,
    };

workerScope.postMessage(response, { transfer: [buffer] });
  }
};
