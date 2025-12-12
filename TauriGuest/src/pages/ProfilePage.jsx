import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Личный кабинет</h2>
        <p>
          Вы не авторизованы. <Link to="/login">Войти</Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2>Личный кабинет</h2>
      <div style={{ marginBottom: 16 }}>
        <div><strong>ID:</strong> {user.id}</div>
        <div><strong>Логин:</strong> {user.login}</div>
        <div><strong>Роль:</strong> {user.is_moderator ? "Модератор" : "Пользователь"}</div>
      </div>

      <h3>Смена пароля (заглушка)</h3>
      <p>Здесь позже можно будет реализовать смену пароля через отдельный endpoint бэкенда.</p>
    </div>
  );
}


