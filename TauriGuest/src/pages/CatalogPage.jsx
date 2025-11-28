import React, { useEffect, useMemo, useState } from "react";
import { fetchCatalog } from "../api";

export function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await fetchCatalog();
        setProducts(p);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка загрузки каталога");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const title = (p.Title || "").toLowerCase();
      const desc = (p.Description || "").toLowerCase();
      const power = (p.Power || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || power.includes(q);
    });
  }, [products, search]);

  if (loading) return <div style={{ padding: 24 }}>Загрузка каталога...</div>;
  if (error)
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка при загрузке каталога: {error}
      </div>
    );

  return (
    <div style={{ padding: 16 }}>
      <h2>Каталог обогревателей</h2>

      <div style={{ margin: "12px 0 20px" }}>
        <input
          type="text"
          placeholder="Поиск по названию, описанию или мощности..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // 4 карточки в строке
          gap: 16,
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.ID}
            style={{
              background: "#0567B7",
              color: "white",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 280,
            }}
          >
            <img
              src={
                p.Image ||
                "https://via.placeholder.com/400x240?text=Heater"
              }
              alt={p.Title}
              style={{ width: "100%", height: 160, objectFit: "cover" }}
            />
            <div
              style={{
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flex: 1,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 16 }}>{p.Title}</div>
              <div style={{ fontSize: 13, opacity: 0.95 }}>
                {p.Description || p.Efficiency || "Описание скоро будет"}
              </div>
              {p.Power && (
                <div style={{ marginTop: "auto", fontSize: 13 }}>
                  Мощность: {p.Power}
                </div>
              )}
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 40 }}>
            Товары не найдены по запросу "{search}"
          </div>
        )}
      </div>
    </div>
  );
}


