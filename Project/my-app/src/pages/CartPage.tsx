// src/pages/CartPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import type { Request } from "../types";
import "./cart.css";
import defaultImage from "../assets/DefaultImage.jpg";

type CartPageProps = {
  cartCount: number;
  clearCart: () => void;
};

type CartApiResponse = {
  success: boolean;
  message: string;
  data?: {
    cart_count?: number;
    items?: Request[];
  };
};

const CartPage: React.FC<CartPageProps> = ({ cartCount, clearCart }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Локальные значения для верхних полей (делаем их редактируемыми)
  const [placeSquare, setPlaceSquare] = useState<string>("");
  const [outsideTemp, setOutsideTemp] = useState<string>("");
  const [insideTemp, setInsideTemp] = useState<string>("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Ошибка загрузки корзины: ${res.status}`);
        }

        const json = (await res.json()) as CartApiResponse;
        const items = json.data?.items ?? [];
        setRequests(items);

        const first = items[0];
        if (first) {
          setPlaceSquare(
            first.PlaceSquare !== undefined && first.PlaceSquare !== null
              ? String(first.PlaceSquare)
              : ""
          );
          setOutsideTemp(
            first.OutsideTemperature !== undefined && first.OutsideTemperature !== null
              ? String(first.OutsideTemperature)
              : ""
          );
          setInsideTemp(
            first.InsideTemperature !== undefined && first.InsideTemperature !== null
              ? String(first.InsideTemperature)
              : ""
          );
        } else {
          setPlaceSquare("");
          setOutsideTemp("");
          setInsideTemp("");
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки корзины");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const firstRequest = requests[0];

  const handleClearCart = () => {
    // Очищаем корзину на сервере и в локальном состоянии
    clearCart();
    setRequests([]);
    setPlaceSquare("");
    setOutsideTemp("");
    setInsideTemp("");
    // Перенаправляем пользователя обратно в каталог
    navigate("/catalog");
  };

  return (
    <div className="cart-page">
      <Header cartCount={cartCount} />

      <main className="cart-main">
        <div className="cart-header-row">
          <h1 className="cart-title">Корзина</h1>
          {requests.length > 0 && (
            <button type="button" className="clear-button" onClick={handleClearCart}>
              Очистить корзину
            </button>
          )}
        </div>

        {loading && <div className="cart-loading">Загрузка...</div>}
        {error && !loading && (
          <div className="cart-error">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className="cart-empty">Ваша корзина пуста.</p>
        )}

        {!loading && !error && requests.length > 0 && (
          <>
            {/* Верхние поля как в старом HTML */}
            <div className="input-container">
              <div className="input-block">
                <div className="input-label">Площадь помещения</div>
                <input
                  type="text"
                  className="input-field"
                  value={placeSquare}
                  onChange={(e) => setPlaceSquare(e.target.value)}
                />
              </div>
              <div className="input-block">
                <div className="input-label">Температура за помещением</div>
                <input
                  type="text"
                  className="input-field"
                  value={outsideTemp}
                  onChange={(e) => setOutsideTemp(e.target.value)}
                />
              </div>
              <div className="input-block">
                <div className="input-label">Температура в помещении</div>
                <input
                  type="text"
                  className="input-field"
                  value={insideTemp}
                  onChange={(e) => setInsideTemp(e.target.value)}
                />
              </div>
            </div>

            {/* Карточки товаров, как в application.html, с возможностью редактирования объёма */}
            <div className="cards-container">
              {requests.map((req, reqIndex) =>
                (req.RequestHeaters ?? []).map((rh, rhIndex) => (
                  <div className="card" key={`${req.ID}-${rhIndex}`}>
                    <img
                      src={rh.HeaterProduct.Image || defaultImage}
                      alt={rh.HeaterProduct.Title}
                      className="card-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultImage;
                      }}
                    />
                    <div className="card-text-row">
                      <div className="card-text-block block-title">
                        {rh.HeaterProduct.Title}
                      </div>
                      <div className="card-divider" />
                      <div className="card-text-block block-specs">
                        {rh.HeaterProduct.Power}
                      </div>
                      <div className="card-divider" />
                      <div className="card-text-block block-input">
                        <div className="input-label">Объём носителя</div>
                        <input
                          type="text"
                          className="card-input"
                          value={rh.Area ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRequests((prev) =>
                              prev.map((reqItem, i) => {
                                if (i !== reqIndex) return reqItem;
                                return {
                                  ...reqItem,
                                  RequestHeaters: reqItem.RequestHeaters?.map(
                                    (innerRh, j) =>
                                      j === rhIndex ? { ...innerRh, Area: value } : innerRh
                                  ),
                                };
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;

