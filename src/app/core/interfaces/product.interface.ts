export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id_product: number;
  id_category: number;
  id_subcategory: number;
  id_brand: number;
  title: string;
  price_special: number;
  price_list: number;
  discount_settlement: unknown;
  images: ProductImage[];
  stock: number;
  main_code: string[];
  warranty: number;
  official_warranty: number;
  vat: number;
  url_search: string;
  specifications?: unknown;
  id_cart?: string;
}
