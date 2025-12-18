import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadRequestsListHeaters,
  moderateRequestHeaters,
} from "../slices/requestsSlice";

export function RequestsListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);
  const isModerator = Boolean(user && user.is_moderator);

  const today = new Date().toISOString().slice(0, 10);
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [status, setStatus] = useState("all");
  const [topic, setTopic] = useState("");
  const [creatorId, setCreatorId] = useState("");

  // Short polling списка заявок с фильтрами по дате/статусу на бэкенде
  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    const fetchData = () => {
      dispatch(
        loadRequestsListHeaters({
          from: dateFrom || undefined,
          to: dateTo || undefined,
          status,
        }),
      ).finally(() => {
        if (!cancelled) {
          timeoutId = setTimeout(fetchData, 5000);
        }
      });
    };

    fetchData();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dispatch, dateFrom, dateTo, status]);

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("ru-RU");
  };

  const filtered = useMemo(() => {
    const topicNorm = topic.trim().toLowerCase();
    const creatorNorm = creatorId.trim();

    return list.filter((req) => {
      if (creatorNorm) {
        const creator =
          String(req.CreatorID ?? req.creatorID ?? req.UserID ?? req.userID ?? "");
        if (creator !== creatorNorm) return false;
      }

      if (topicNorm) {
        const heaters = req.RequestHeaters || req.requestHeaters || [];
        const titles = heaters
          .map((rh) => rh.HeaterProduct?.Title || rh.heaterProduct?.title || "")
          .join(" ")
          .toLowerCase();
        if (!titles.includes(topicNorm)) return false;
      }

      return true;
    });
  }, [list, topic, creatorId]);

  const nonEmptyCount = useMemo(
    () =>
      filtered.filter(
        (req) =>
          (req.RequestHeaters || req.requestHeaters || []).length > 0,
      ).length,
    [filtered],
  );

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
        <div>
          <label>
            Тема:&nbsp;
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Поиск по услугам"
              style={{ minWidth: 160 }}
            />
          </label>
        </div>
        {isModerator && (
          <div>
            <label>
              Создатель (ID):&nbsp;
              <input
                type="number"
                value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)}
                style={{ width: 80 }}
              />
            </label>
          </div>
        )}
      </div>

      <div style={{ fontSize: 13, marginBottom: 8, color: "#4b5563" }}>
        Не пустых заявок: <strong>{nonEmptyCount}</strong> из{" "}
        <strong>{filtered.length}</strong>
      </div>

      {filtered.length === 0 ? (
        <p>Заявок пока нет.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
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
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background:
                    "linear-gradient(90deg, #f3f4ff 0, #ffffff 28%, #ffffff 100%)",
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  boxShadow: "0 6px 14px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: 6,
                    marginBottom: 4,
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: 15, color: "#0f172a" }}>
                    Заявка #{req.ID}
                  </div>
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      background: "#e5f2ff",
                      color: "#0567b7",
                      fontWeight: 500,
                    }}
                  >
                    {req.Status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    color: "#4b5563",
                  }}
                >
                  <div>Создана: {createdAt}</div>
                  <div>Отправлена: {submittedAt}</div>
                  <div>Завершена: {completedAt}</div>
                  <div>Обновлена: {updatedAt}</div>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    marginTop: 4,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div>Количество позиций: {itemsCount}</div>
                  <div>
                    Стоимость:{" "}
                    {req.Cost != null ? `${req.Cost.toFixed(2)} ₽` : "-"}
                  </div>
                  {req.Result != null && (
                    <div>Результат: {req.Result.toFixed(3)}</div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/heaters-applications/${req.ID}`)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: "none",
                      background: "#0567b7",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    Открыть заявку
                  </button>

                  {isModerator && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            moderateRequestHeaters({
                              requestId: req.ID,
                              status: "завершено",
                            }),
                          )
                        }
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: "1px solid #16a34a",
                          background: "#dcfce7",
                          color: "#166534",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Завершить
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            moderateRequestHeaters({
                              requestId: req.ID,
                              status: "отклонено",
                            }),
                          )
                        }
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: "1px solid #f97316",
                          background: "#fff7ed",
                          color: "#c2410c",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


