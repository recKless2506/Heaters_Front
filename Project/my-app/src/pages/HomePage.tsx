// src/pages/HomePage.tsx
import React from "react";
import Header from "../components/Header";
import "./home.css";

const HomePage: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  return (
    <div className="home-page">
      <Header cartCount={cartCount} hideLogo />

      <div className="home-container">
        <h1>Добро пожаловать в магазин теплонагревателей</h1>
        <p>Выберите подходящий прибор в меню.</p>
      </div>
    </div>
  );
};

export default HomePage;
