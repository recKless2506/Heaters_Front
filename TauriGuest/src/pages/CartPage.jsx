import React, { useEffect, useState } from "react";
import { fetchCart } from "../api";

export function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCart();
        setItems(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка загрузки корзины");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Загрузка корзины...</div>;
  if (error)
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка при загрузке корзины: {error}
      </div>
    );
  if (!items.length) return <div style={{ padding: 24 }}>Корзина пуста.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Корзина (черновики заявок)</h2>

      {items.map((req) => (
        <div
          key={req.ID}
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#f9fafb",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Заявка #{req.ID}
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            Площадь: {req.PlaceSquare ?? "-"} м²,&nbsp;
            Tнар: {req.OutsideTemperature ?? "-"}°C,&nbsp;
            Tвн: {req.InsideTemperature ?? "-"}°C
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(req.RequestHeaters ?? []).map((rh) => (
              <div
                key={`${rh.HeatersProductRequestID}-${rh.HeatersProductID}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 8,
                  borderRadius: 8,
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden" }}>
                  <img
                    src={
                      rh.HeaterProduct?.Image ||
                      "https://via.placeholder.com/80x80?text=H"
                    }
                    alt={rh.HeaterProduct?.Title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {rh.HeaterProduct?.Title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>
                    Площадь: {rh.Area ?? 0} м², мощность:{" "}
                    {rh.HeaterProduct?.Power ?? "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


