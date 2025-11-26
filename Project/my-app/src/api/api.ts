import type { HeaterProduct, Request } from "../types";

// Используем /api префикс - Vite proxy перенаправит на backend
const API_BASE = "/api";

type CatalogResponse = {
  success: boolean;
  message: string;
  data?: {
    cart_count?: number;
    products?: HeaterProduct[];
  };
};

type CartResponse = {
  success: boolean;
  message: string;
  data?: {
    cart_count?: number;
    items?: Request[];
  };
};

export async function fetchCatalog(): Promise<{ products: HeaterProduct[]; cartCount: number }> {
  const res = await fetch(`${API_BASE}/catalog_heaters`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch catalog");

  const json = (await res.json()) as CatalogResponse;
  return {
    products: json.data?.products ?? [],
    cartCount: json.data?.cart_count ?? 0,
  };
}

export async function fetchCartSummary(): Promise<number> {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const json = (await res.json()) as CartResponse;
  return json.data?.cart_count ?? 0;
}

export async function fetchHeaterById(id: number | string) {
  const res = await fetch(`${API_BASE}/heater/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch heater");

  const json = await res.json();
  return json.data?.product ?? json.data ?? json;
}
