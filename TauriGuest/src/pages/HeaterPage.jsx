import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../api/index";
import { removeRequestItemHeaters } from "../slices/requestsSlice";

export function HeaterPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [heater, setHeater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await api.heater.heaterDetail(Number(id));
        if (!isMounted) return;
        setHeater(resp.data);
        setError(null);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.response?.data?.message || e?.message || "Ошибка загрузки товара");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRemoveItem = (productId) => {
    if (!heater?.id) return;
    dispatch(
      removeRequestItemHeaters({
        requestId: heater.id,
        productId,
      }),
    ).then((action) => {
      if (removeRequestItemHeaters.fulfilled.match(action)) {
        api.heater
          .heaterDetail(heater.id)
          .then((resp) => setHeater(resp.data))
          .catch(() => {});
      }
    });
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Загрузка товара...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка при загрузке товара: {error}
      </div>
    );
  }

  if (!heater) {
    return (
      <div style={{ padding: 24 }}>
        <p>Товар не найден.</p>
      </div>
    );
  }

  const isDraft = heater.status === "черновик";
  const items = heater.requestHeaters || [];

  return (
    <div className="heater-page">
      <div className="heater-container">
        <div className="heater-image">
          <img
            src={heater.image || "https://via.placeholder.com/400x300?text=Heater"}
            alt={heater.title}
          />
        </div>
        <div className="heater-content">
          <h1 className="heater-title">{heater.title}</h1>

          <div className="heater-section-title">Описание</div>
          <div className="heater-text">
            {heater.description || "Описание пока не добавлено."}
          </div>

          <div className="heater-section-title">Технические характеристики</div>
          <div className="heater-text">
            <p>
              <strong>Мощность:</strong> {heater.power || "—"}
            </p>
            <p>
              <strong>КПД:</strong> {heater.efficiency || "—"}
            </p>
          </div>

          {items.length > 0 && (
            <>
              <div className="heater-section-title">Товары в заявке</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {items.map((rh) => (
                  <div
                    key={(rh.heatersProductRequestID || rh.HeatersProductRequestID) + "-" + (rh.heatersProductID || rh.HeatersProductID)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{rh.heaterProduct?.title || rh.HeaterProduct?.Title}</div>
                      <div style={{ fontSize: 13, opacity: 0.85 }}>
                        Площадь: {rh.area ?? rh.Area ?? 0} м², мощность:{" "}
                        {rh.heaterProduct?.power || rh.HeaterProduct?.Power || "-"}
                      </div>
                    </div>
                    {isDraft && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(rh.heatersProductID || rh.HeatersProductID)
                        }
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          border: "1px solid #ef4444",
                          background: "#ffffff",
                          color: "#b91c1c",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



