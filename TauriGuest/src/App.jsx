import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RequestsListPage } from "./pages/RequestsListPage";
import { RequestPage } from "./pages/RequestPage";
import { HeaterPage } from "./pages/HeaterPage";
import { logout } from "./slices/authSlice";
import { resetRequestsState } from "./slices/requestsSlice";
import { resetCatalogState } from "./slices/catalogSlice";
import CartIcon from "./components/CartIcon";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const draft = useSelector((state) => state.requests.draft);
  const { isGlobalLoading } = useSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetRequestsState());
    dispatch(resetCatalogState());
  };

  return (
    <BrowserRouter>
      <div className="app-root">
        {isGlobalLoading && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Загрузка...
          </div>
        )}
        <header className="app-header">
          {/* Иконка "домой" как на макете */}
          <Link to="/" className="app-logo home-icon" aria-label="Домой">
            <svg
              className="home-icon-svg"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
                fill="white"
              />
            </svg>
          </Link>

          {/* Горизонтальное меню прямо в хедере */}
          <nav className="app-main-nav">
            <Link to="/">Главная</Link>
            <Link to="/heaters-catalog">Каталог</Link>
            <Link to="/heaters-cart">Корзина</Link>
            <Link to="/heaters-applications">Мои заявки</Link>
            <Link to="/heaters-profile">Личный кабинет</Link>
          </nav>

          <div className="app-auth-info">
            {user ? (
              <>
                <span className="app-user-name">
                  {loading ? "..." : `Пользователь: ${user.login}`}
                </span>
                <button onClick={handleLogout}>Выход</button>
              </>
            ) : (
              <>
                <Link to="/heaters-login">Вход</Link>
                <Link to="/heaters-register">Регистрация</Link>
              </>
            )}
          </div>

          <div className="app-draft-link">
            {draft ? (
              <Link to={`/heaters-applications/${draft.ID}`}>Перейти к черновику</Link>
            ) : (
              <span className="app-draft-link-disabled">Черновик заявки отсутствует</span>
            )}
          </div>
        </header>

        {/* Иконка корзины под хедером (не показываем на странице входа) */}
        {typeof window !== "undefined" &&
          window.location.pathname !== "/heaters-login" && (
          <CartIcon />
        )}

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/heaters-catalog" element={<CatalogPage />} />
            <Route path="/heaters-catalog/:id" element={<HeaterPage />} />
            <Route path="/heaters-cart" element={<CartPage />} />
            <Route path="/heaters-login" element={<LoginPage />} />
            <Route path="/heaters-register" element={<RegisterPage />} />
            <Route path="/heaters-profile" element={<ProfilePage />} />
            <Route path="/heaters-applications" element={<RequestsListPage />} />
            <Route path="/heaters-applications/:id" element={<RequestPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
