// src/components/Header.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";

type HeaderProps = {
  cartCount?: number;
  hideLogo?: boolean;
};

const Header: React.FC<HeaderProps> = ({ cartCount = 0, hideLogo = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCartEmpty = (cartCount ?? 0) <= 0;

  return (
    <header className="header">
      {!hideLogo && (
        <div className="logo">
          <Link to="/">
            {/* svg логотип */}
            <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)"><path d="M21.79 55.4667L21.7879 35.8916L34.2624 35.8903L34.2644 55.4654L49.8574 55.4638L49.8547 29.3637L59.2105 29.3627L28.0214 0.00324703L-3.16159 29.3692L6.19423 29.3682L6.19693 55.4683L21.79 55.4667Z" fill="white"/></g>
              <defs><clipPath id="clip0"><rect width="57.6862" height="57.6862" fill="white"/></clipPath></defs>
            </svg>
          </Link>
        </div>
      )}

      {/* Выпадающее меню */}
      <div className="dropdown-container">
        <button 
          className="dropdown-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          Меню
          <svg className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <Link to="/catalog" className="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Каталог
            </Link>
            {isCartEmpty ? (
              <div className="dropdown-item dropdown-item--disabled">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="20" cy="21" r="1" fill="currentColor" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Корзина (пуста)
              </div>
            ) : (
              <Link to="/cart" className="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="20" cy="21" r="1" fill="currentColor" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Корзина
                {cartCount > 0 && <span className="dropdown-badge">{cartCount}</span>}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
