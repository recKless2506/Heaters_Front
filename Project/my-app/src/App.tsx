import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import HeaterPage from "./pages/HeaterPage";
import ApplicationPage from "./pages/ApplicationPage";
import CartPage from "./pages/CartPage";
import type { HeaterProduct, Request } from "./types";
import { fetchCatalog, fetchCartSummary } from "./api/api";

const App: React.FC = () => {
  const [products, setProducts] = useState<HeaterProduct[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [requests, setRequests] = useState<Request[]>([]);
  // Для "гостя": пока он сам не добавил товар в эту сессию, иконка показывает 0
  const [hasLocalCart, setHasLocalCart] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [catalog, cartCountFromServer] = await Promise.all([
          fetchCatalog(),
          fetchCartSummary(),
        ]);
        setProducts(catalog.products);
        // Сохраняем реальное количество в состоянии,
        // но для гостя по умолчанию будем его скрывать (hasLocalCart = false)
        setCartCount(Math.max(catalog.cartCount, cartCountFromServer));
      } catch (e) {
        console.error("Failed to load catalog:", e);
      }
    })();
  }, []);

  const onAddToCart = (product: HeaterProduct) => {
    // Сначала отправляем на сервер, затем обновляем счётчик из реального состояния корзины
    fetch(`/api/add-to-cart/${product.ID}`, {
      method: "POST",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`add-to-cart failed: ${res.status}`);
        }
        const newCount = await fetchCartSummary();
        setCartCount(newCount);
        setHasLocalCart(true);
      })
      .catch((err) => console.warn("add-to-cart failed", err));
  };

  const clearCart = () => {
    setRequests([]);
    fetch("/api/clear-cart", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`clear-cart failed: ${res.status}`);
        }
        const newCount = await fetchCartSummary();
        setCartCount(newCount);
        if (newCount === 0) {
          setHasLocalCart(false);
        }
      })
      .catch((err) => console.warn("clear-cart failed", err));
  };

  const displayCartCount = hasLocalCart ? cartCount : 0;

  return (
    <Routes>
      {/* Главный экран */}
      <Route path="/" element={<HomePage cartCount={displayCartCount} />} />

      {/* Каталог товаров */}
      <Route
        path="/catalog"
        element={
          <CatalogPage
            products={products}
            cartCount={displayCartCount}
            onAddToCart={onAddToCart}
          />
        }
      />
      <Route path="/heater/:id" element={<HeaterPage products={products} cartCount={displayCartCount} />} />
      <Route path="/cart" element={<CartPage cartCount={displayCartCount} clearCart={clearCart} />} />
      <Route path="/heaters_application" element={<ApplicationPage requests={requests} clearCart={clearCart} />} />
    </Routes>
  );
};

export default App;
