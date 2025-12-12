import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadRequestsList } from "../slices/requestsSlice";

export function RequestsListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((state) => state.requests);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(loadRequestsList());
  }, [dispatch]);

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("ru-RU");
  };

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    return list.filter((req) => {
      const createdRaw = req.CreatedAt || req.createdAt;
      const created = createdRaw ? new Date(createdRaw) : null;

      if (from && (!created || created < from)) return false;
      if (to) {
        // включительно по дате "до"
        const toEnd = new Date(to);
        toEnd.setDate(toEnd.getDate() + 1);
        if (!created || created >= toEnd) return false;
      }

      if (status !== "all" && req.Status !== status) return false;

      return true;
    });
  }, [list, dateFrom, dateTo, status]);

  if (loading) {
    return <div style={{ padding: 24 }}>Загрузка заявок...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка при загрузке заявок: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Мои заявки</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          margin: "8px 0 16px",
          fontSize: 13,
        }}
      >
        <div>
          <label>
            С даты:&nbsp;
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            По дату:&nbsp;
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Статус:&nbsp;
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="черновик">Черновик</option>
              <option value="создано">Создано</option>
              <option value="завершено">Завершено</option>
              <option value="отклонено">Отклонено</option>
              <option value="удален">Удалено</option>
            </select>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>Заявок пока нет.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          {filtered.map((req) => {
            const itemsCount = (req.RequestHeaters || req.requestHeaters || []).length;
            const createdAt = formatDate(req.CreatedAt || req.createdAt);
            const submittedAt = formatDate(req.SubmittedAt || req.submittedAt);
            const completedAt = formatDate(req.CompletedAt || req.completedAt);
            const updatedAt = formatDate(req.UpdatedAt || req.updatedAt);

            return (
              <div
                key={req.ID}
                style={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 600 }}>Заявка #{req.ID}</div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      background: "#e5f2ff",
                      color: "#0567b7",
                    }}
                  >
                    {req.Status}
                  </span>
                </div>

                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div>Создана: {createdAt}</div>
                  <div>Отправлена: {submittedAt}</div>
                  <div>Завершена: {completedAt}</div>
                  <div>Обновлена: {updatedAt}</div>
                </div>

                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <div>Количество позиций: {itemsCount}</div>
                  <div>Стоимость: {req.Cost != null ? req.Cost.toFixed(2) : "-"} ₽</div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/applications/${req.ID}`)}
                  style={{
                    marginTop: 8,
                    alignSelf: "flex-start",
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#0567b7",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Открыть
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


