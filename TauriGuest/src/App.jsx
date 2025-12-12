import React, { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <Link to="/login">Вход</Link>
                <Link to="/register">Регистрация</Link>
              </>
            )}
          </div>

          <div className="app-draft-link">
            {draft ? (
              <Link to={`/applications/${draft.ID}`}>Перейти к черновику</Link>
            ) : (
              <span className="app-draft-link-disabled">Черновик заявки отсутствует</span>
            )}
          </div>

          <button
            className="app-menu-button"
            type="button"
            onClick={() => setIsMenuOpen(true)}
          >
            Меню
          </button>
        </header>

        {/* Иконка корзины под хедером */}
        <CartIcon />

        {/* Всплывающее окно-список разделов */}
        {isMenuOpen && (
          <div className="app-menu-backdrop" onClick={() => setIsMenuOpen(false)}>
            <div className="app-menu-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="app-menu-title">Навигация</h3>
              <ul className="app-menu-list">
                <li>
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    Главная
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                    Корзина
                  </Link>
                </li>
                <li>
                  <Link to="/applications" onClick={() => setIsMenuOpen(false)}>
                    Мои заявки
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    Личный кабинет
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:id" element={<HeaterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/applications" element={<RequestsListPage />} />
            <Route path="/applications/:id" element={<RequestPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
