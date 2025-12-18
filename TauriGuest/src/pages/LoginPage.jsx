import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUserHeaters } from "../slices/authSlice";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login || !password) return;
    dispatch(loginUserHeaters({ login, password }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top left, #e0f2fe 0, #bfdbfe 25%, #eff6ff 55%, #f9fafb 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          padding: 28,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
          border: "1px solid rgba(148,163,184,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: 999,
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            Вход в систему
          </div>
          <h2
            style={{
              margin: "12px 0 4px",
              fontSize: 24,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Добро пожаловать назад
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            Введите логин и пароль, чтобы продолжить работу с сервисом.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="login"
              style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
            >
              Логин
            </label>
            <input
              id="login"
              type="text"
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              style={{
                height: 40,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s, background-color 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563eb";
                e.target.style.boxShadow = "0 0 0 1px rgba(37,99,235,0.25)";
                e.target.style.backgroundColor = "#eff6ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
                e.target.style.backgroundColor = "#ffffff";
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="password"
              style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                height: 40,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s, background-color 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563eb";
                e.target.style.boxShadow = "0 0 0 1px rgba(37,99,235,0.25)";
                e.target.style.backgroundColor = "#eff6ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
                e.target.style.backgroundColor = "#ffffff";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              height: 42,
              borderRadius: 999,
              border: "none",
              background: loading
                ? "linear-gradient(to right, #9ca3af, #6b7280)"
                : "linear-gradient(to right, #2563eb, #0ea5e9)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "default" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 10px 20px rgba(37,99,235,0.35)",
              transition:
                "transform 0.1s ease-out, box-shadow 0.15s ease-out, filter 0.15s ease-out",
              filter: loading ? "grayscale(0.2)" : "none",
            }}
            onMouseDown={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = "translateY(1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(37,99,235,0.28)";
            }}
            onMouseUp={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 20px rgba(37,99,235,0.35)";
            }}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          <span>Нет аккаунта?</span>
          <Link
            to="/heaters-register"
            style={{
              color: "#2563eb",
              fontWeight: 500,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}


