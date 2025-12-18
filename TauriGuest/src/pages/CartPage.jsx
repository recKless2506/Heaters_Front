import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearDraftHeaters,
  loadDraftRequestHeaters,
  removeRequestItemHeaters,
  updateDraftParamsHeaters,
  submitDraftRequestHeaters,
} from "../slices/requestsSlice";

export function CartPage() {
  const dispatch = useDispatch();
  const { draft, loading, error } = useSelector((state) => state.requests);
  const navigate = useNavigate();

  const [placeSquare, setPlaceSquare] = useState("");
  const [outsideTemperature, setOutsideTemperature] = useState("");
  const [insideTemperature, setInsideTemperature] = useState("");
  const [calculatedCost, setCalculatedCost] = useState(null);

  useEffect(() => {
    dispatch(loadDraftRequestHeaters());
  }, [dispatch]);

  useEffect(() => {
    if (draft) {
      setPlaceSquare(
        draft.PlaceSquare !== undefined && draft.PlaceSquare !== null
          ? String(draft.PlaceSquare)
          : "",
      );
      setOutsideTemperature(
        draft.OutsideTemperature !== undefined && draft.OutsideTemperature !== null
          ? String(draft.OutsideTemperature)
          : "",
      );
      setInsideTemperature(
        draft.InsideTemperature !== undefined && draft.InsideTemperature !== null
          ? String(draft.InsideTemperature)
          : "",
      );
    }
  }, [draft]);

  // Поддерживаем локальное поле "Рассчитано по формуле" в синхроне с полем Result из БД
  useEffect(() => {
    if (draft && typeof draft.Result === "number" && Number.isFinite(draft.Result)) {
      setCalculatedCost(draft.Result);
    }
  }, [draft && draft.Result]);

  const handleSaveParams = () => {
    const ps = parseFloat(placeSquare || "0");
    const tOut = parseFloat(outsideTemperature || "0");
    const tIn = parseFloat(insideTemperature || "0");

    return dispatch(
      updateDraftParamsHeaters({
        placeSquare: Number.isNaN(ps) ? 0 : ps,
        outsideTemperature: Number.isNaN(tOut) ? 0 : tOut,
        insideTemperature: Number.isNaN(tIn) ? 0 : tIn,
      }),
    );
  };

  const handleSubmitDraft = async () => {
    // Сначала сохраняем введённые параметры, затем формируем заявку
    const actionSave = await handleSaveParams();
    if (updateDraftParamsHeaters.rejected.match(actionSave)) {
      return;
    }

    await dispatch(submitDraftRequestHeaters());
  };

  const handleClear = async () => {
    const action = await dispatch(clearDraftHeaters());
    if (clearDraftHeaters.fulfilled.match(action)) {
      navigate("/heaters-catalog");
    }
  };

  const handleRemoveItem = (productId) => {
    if (!draft) return;
    dispatch(
      removeRequestItemHeaters({
        requestId: draft.ID,
        productId,
      }),
    );
  };

  const handleCalculateCost = async () => {
    if (!draft) return;

    // Сначала сохраняем введённые параметры в БД (там же пересчитывается cost/result)
    const actionSave = await handleSaveParams();
    if (updateDraftParamsHeaters.rejected.match(actionSave)) {
      return;
    }
    // После успешного сохранения сработает useEffect выше и подхватит draft.Result из БД.
  };

  if (loading) return <div style={{ padding: 24 }}>Загрузка корзины...</div>;
  if (error)
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка при загрузке/обновлении корзины: {error}
      </div>
    );
  if (!draft) return <div style={{ padding: 24 }}>Корзина пуста.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Корзина (черновик заявки)</h2>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "#f9fafb",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 12 }}>
          Заявка #{draft.ID}
          {draft.Status && (
            <span style={{ marginLeft: 8, fontWeight: 400, fontSize: 13 }}>
              (статус: {draft.Status === "черновик" ? "черновик" : draft.Status === "создано" ? "сформирована" : draft.Status})
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 12,
            fontSize: 13,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span>Площадь:</span>{" "}
            <input
              type="number"
              min="0"
              step="1"
              value={placeSquare}
              onChange={(e) => setPlaceSquare(e.target.value)}
              style={{
                width: 80,
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                marginRight: 4,
              }}
            />
            <span>м²</span>
          </div>
          <div>
            <span>Tнар:</span>{" "}
            <input
              type="number"
              step="1"
              value={outsideTemperature}
              onChange={(e) => setOutsideTemperature(e.target.value)}
              style={{
                width: 60,
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                marginRight: 4,
              }}
            />
            <span>°C</span>
          </div>
          <div>
            <span>Tвн:</span>{" "}
            <input
              type="number"
              step="1"
              value={insideTemperature}
              onChange={(e) => setInsideTemperature(e.target.value)}
              style={{
                width: 60,
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                marginRight: 4,
              }}
            />
            <span>°C</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button
              type="button"
              onClick={handleSubmitDraft}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "#0567b7",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Сформировать
            </button>
            <button
              type="button"
              onClick={handleCalculateCost}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #0567b7",
                background: "#ffffff",
                color: "#0567b7",
                cursor: "pointer",
              }}
            >
              Рассчитать
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #ef4444",
                background: "#ffffff",
                color: "#b91c1c",
                cursor: "pointer",
              }}
            >
              Очистить корзину
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 8, fontSize: 13 }}>
          <div>
            <strong>Стоимость (в БД):</strong>{" "}
            {draft.Cost != null ? draft.Cost.toFixed(2) : "-"}
          </div>
          <div>
            <strong>Рассчитано по формуле (отопительный сезон):</strong>{" "}
            {calculatedCost != null ? `${calculatedCost.toFixed(2)} ₽` : "—"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(draft.RequestHeaters ?? []).map((rh) => (
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
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  Стоимость услуги (из БД):{" "}
                  {typeof rh.Cost === "number" ? `${rh.Cost.toFixed(2)} ₽` : "—"}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  type="button"
                  onClick={handleSaveParams}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: "1px solid #0567b7",
                    background: "#0567b7",
                    color: "#ffffff",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(rh.HeatersProductID)}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


