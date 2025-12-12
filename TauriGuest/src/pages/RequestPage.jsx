import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadDraftRequest, removeRequestItem, updateDraftParams } from "../slices/requestsSlice";

export function RequestPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { draft, list, loading, error } = useSelector((state) => state.requests);

  const [placeSquare, setPlaceSquare] = useState("");
  const [outsideTemperature, setOutsideTemperature] = useState("");
  const [insideTemperature, setInsideTemperature] = useState("");
  const [calculatedCost, setCalculatedCost] = useState(null);

  useEffect(() => {
    // На всякий случай подгружаем черновик при заходе на страницу
    dispatch(loadDraftRequest());
  }, [dispatch]);

  const numericId = Number(id);

  const fromList = list.find((r) => r.ID === numericId);
  const fromDraft = draft && draft.ID === numericId ? draft : null;
  const request = fromList || fromDraft || null;
  const isDraft = request && request.Status === "черновик";

  useEffect(() => {
    if (request && isDraft) {
      setPlaceSquare(
        request.PlaceSquare !== undefined && request.PlaceSquare !== null
          ? String(request.PlaceSquare)
          : "",
      );
      setOutsideTemperature(
        request.OutsideTemperature !== undefined && request.OutsideTemperature !== null
          ? String(request.OutsideTemperature)
          : "",
      );
      setInsideTemperature(
        request.InsideTemperature !== undefined && request.InsideTemperature !== null
          ? String(request.InsideTemperature)
          : "",
      );
    }
  }, [request, isDraft]);

  const handleSaveParams = () => {
    const ps = parseFloat(placeSquare || "0");
    const tOut = parseFloat(outsideTemperature || "0");
    const tIn = parseFloat(insideTemperature || "0");

    dispatch(
      updateDraftParams({
        placeSquare: Number.isNaN(ps) ? 0 : ps,
        outsideTemperature: Number.isNaN(tOut) ? 0 : tOut,
        insideTemperature: Number.isNaN(tIn) ? 0 : tIn,
      }),
    );
  };

  const handleCalculateCost = () => {
    if (!request) return;

    const areaFromInput =
      isDraft && placeSquare !== ""
        ? parseFloat(placeSquare)
        : Number(request.PlaceSquare || 0);

    const inside =
      isDraft && insideTemperature !== ""
        ? parseFloat(insideTemperature)
        : Number(request.InsideTemperature || 0);
    const outside =
      isDraft && outsideTemperature !== ""
        ? parseFloat(outsideTemperature)
        : Number(request.OutsideTemperature || 0);

    if (Number.isNaN(areaFromInput) || Number.isNaN(inside) || Number.isNaN(outside)) {
      setCalculatedCost(null);
      return;
    }

    const totalAreaForFormula = areaFromInput > 0 ? areaFromInput : 0;
    const deltaT = inside - outside;
    // Новая формула: cost = k * S * (Tin - Tout), где k ~ 15
    const k = 15;
    const cost = k * totalAreaForFormula * deltaT;
    setCalculatedCost(Number.isFinite(cost) ? cost : 0);
  };

  const handleRemoveItem = (productId) => {
    if (!request) return;
    dispatch(
      removeRequestItem({
        requestId: request.ID,
        productId,
      }),
    );
  };

  if (loading && !request) {
    return <div style={{ padding: 24 }}>Загрузка заявки...</div>;
  }

  if (error && !request) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка при загрузке заявки: {error}
      </div>
    );
  }

  if (!request) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Заявка #{id}</h2>
        <p>Заявка не найдена. Откройте сначала список заявок.</p>
      </div>
    );
  }

  const heaters = request.RequestHeaters ?? [];

  return (
    <div style={{ padding: 24 }}>
      <h2>
        Заявка #{request.ID} ({request.Status})
      </h2>
      <div style={{ marginBottom: 12 }}>
        {isDraft ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 13,
              alignItems: "center",
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
            <button
              type="button"
              onClick={handleSaveParams}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "#0567b7",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Сохранить
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
          </div>
        ) : (
          <>
            <div>
              <strong>Площадь:</strong> {request.PlaceSquare ?? "-"} м²
            </div>
            <div>
              <strong>Tнар:</strong> {request.OutsideTemperature ?? "-"} °C
            </div>
            <div>
              <strong>Tвн:</strong> {request.InsideTemperature ?? "-"} °C
            </div>
          </>
        )}
        <div style={{ marginTop: 6, fontSize: 13 }}>
          <div>
            <strong>Стоимость (в БД):</strong> {request.Cost != null ? request.Cost.toFixed(2) : "-"}
          </div>
          <div>
            <strong>Рассчитано по формуле (отопительный сезон):</strong>{" "}
            {calculatedCost != null ? `${calculatedCost.toFixed(2)} ₽` : "—"}
          </div>
        </div>
      </div>

      <h3>Услуги</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {heaters.map((rh) => (
          <div
            key={`${rh.HeatersProductRequestID}-${rh.HeatersProductID}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {rh.HeaterProduct?.Title ?? "Товар"}
                </div>
                <div style={{ fontSize: 12 }}>
                  Площадь: {rh.Area ?? 0} м², мощность: {rh.HeaterProduct?.Power ?? "-"}
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  Стоимость услуги (из БД):{" "}
                  {typeof rh.Cost === "number" ? `${rh.Cost.toFixed(2)} ₽` : "—"}
                </div>
              </div>
              {isDraft && (
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
              )}
          </div>
        ))}
      </div>
    </div>
  );
}


