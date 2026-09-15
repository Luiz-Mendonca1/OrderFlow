export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  id?: string;
  name?: string;
  email?: string;
  role?: User["role"];
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  banner: string;
  disabled: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  amount: number;
  product: Pick<Product, "id" | "name" | "description" | "price" | "banner">;
}

export interface Order {
  id: string;
  name: string | null;
  table: number;
  status: boolean;
  draft: boolean;
  createdAt: string;
  items: OrderItem[];
}
