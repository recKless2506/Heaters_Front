import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCatalog, setSearchValue } from "../slices/catalogSlice";
import { addProductToDraft } from "../slices/requestsSlice";

export function CatalogPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, searchValue } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(loadCatalog());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const title = (p.Title || "").toLowerCase();
      const desc = (p.Description || "").toLowerCase();
      const power = (p.Power || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || power.includes(q);
    });
  }, [items, searchValue]);

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
          value={searchValue}
          onChange={(e) => dispatch(setSearchValue(e.target.value))}
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
              cursor: "pointer",
            }}
            onClick={() => navigate(`/catalog/${p.ID}`)}
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
            <button
              style={{
                margin: 12,
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: "#ffffff",
                color: "#0567B7",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addProductToDraft(p.ID));
              }}
            >
              Добавить
            </button>
          </div>
        ))}

        {!filtered.length && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 40 }}>
            Товары не найдены по запросу "{searchValue}"
          </div>
        )}
      </div>
    </div>
  );
}


