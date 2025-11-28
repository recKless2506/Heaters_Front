import type { HeaterProduct, Request } from "../types";

// Используем /api префикс - Vite proxy перенаправит на backend (в dev)
const API_BASE = "/api";

// Небольшой мок, чтобы каталог не был пустым на GitHub Pages (где backend недоступен)
const MOCK_PRODUCTS: HeaterProduct[] = [
  {
    ID: 1,
    Title: "Электрический обогреватель 2 кВт",
    // Картинка для GitHub Pages (находится в public/)
    Image: "pwa-192x192.png",
    Power: "2 кВт",
    Description: "Компактный обогреватель для небольших помещений.",
    Efficiency: "КПД 95%",
  },
  {
    ID: 2,
    Title: "Тепловая пушка 5 кВт",
    Image: "pwa-512x512.png",
    Power: "5 кВт",
    Description: "Мощная тепловая пушка для гаража или мастерской.",
    Efficiency: "КПД 92%",
  },
];

const isGhPages =
  typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

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
  try {
    const res = await fetch(`${API_BASE}/catalog_heaters`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch catalog");

    const json = (await res.json()) as CatalogResponse;
    return {
      products: json.data?.products ?? [],
      cartCount: json.data?.cart_count ?? 0,
    };
  } catch (err) {
    // На GitHub Pages backend недоступен — показываем моковые данные, чтобы каталог не был пустым
    if (isGhPages) {
      return { products: MOCK_PRODUCTS, cartCount: 0 };
    }
    throw err;
  }
}

export async function fetchCartSummary(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const json = (await res.json()) as CartResponse;
    return json.data?.cart_count ?? 0;
  } catch (err) {
    if (isGhPages) {
      return 0;
    }
    throw err;
  }
}

export async function fetchHeaterById(id: number | string) {
  try {
    const res = await fetch(`${API_BASE}/heater/${id}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch heater");

    const json = await res.json();
    return json.data?.product ?? json.data ?? json;
  } catch (err) {
    if (isGhPages) {
      // На GitHub Pages просто возвращаем соответствующий мок, чтобы страница товара открывалась
      return MOCK_PRODUCTS.find((p) => String(p.ID) === String(id)) ?? MOCK_PRODUCTS[0];
    }
    throw err;
  }
}
