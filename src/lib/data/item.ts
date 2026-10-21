
export type ItemStatus = "active" | "inactive";

export type Item = {
  id: number;
  name: string;
  category: string;
  price: number;
  status: ItemStatus;
};
