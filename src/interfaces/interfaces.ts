export interface Product {
  code: string;
  name: string;
  sales_price: number;
  new_price: number;
  error?: string;
}

export interface TableEmptyProps {
  productsQty: number;
}
