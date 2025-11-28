// Простой клиент для API по IP (НЕ localhost)
// ВАЖНО: замени IP на адрес машины, где крутится Go-бэкенд.

export const API_BASE = "http://192.168.1.10:8001"; // IP твоего Wi‑Fi адаптера

export async function fetchCatalog() {
  const res = await fetch(`${API_BASE}/catalog_heaters`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Не удалось загрузить каталог: ${res.status}`);
  }
  const json = await res.json();
  // ожидаем структуру как в веб-проекте: { data: { products: [...] } }
  return json.data?.products ?? [];
}

export async function fetchCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Не удалось загрузить корзину: ${res.status}`);
  }
  const json = await res.json();
  // ожидаем структуру с заявками и их товарами
  return json.data?.items ?? json.data?.requests ?? [];
}


