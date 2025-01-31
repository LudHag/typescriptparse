export type Name = string;

export interface Age {
  years: number;
  months: number;
}

export type Price = {
  currency: "sek" | "usd";
  value: number;
};

export type Product = {
  productId: number;
  name: string;
  price: Price;
  description?: string;
  imageUrl: string | null;
};
