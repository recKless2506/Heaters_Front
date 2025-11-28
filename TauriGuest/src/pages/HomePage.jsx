import React from "react";

export function HomePage() {
  return (
    <div
      style={{
        padding: 24,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <h1>Обогреватели для вашего дома</h1>
      <p style={{ maxWidth: 480 }}>
        Гостевой интерфейс: выберите подходящий обогреватель в каталоге и
        посмотрите содержимое корзины. Здесь нет авторизации и редактирования —
        только просмотр.
      </p>
      <img
        src="https://via.placeholder.com/480x260?text=Heaters"
        alt="Обогреватель"
        style={{ maxWidth: "100%", borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
      />
    </div>
  );
}


