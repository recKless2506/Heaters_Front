import React from "react";
import { Link } from "react-router-dom";
import type { HeaterProduct } from "../types";
import "./productcard.css";
import defaultImage from "../assets/DefaultImage.jpg";

type Props = {
  product: HeaterProduct;
  onAddToCart: (p: HeaterProduct) => void;
};

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.Image || defaultImage}
        alt={product.Title}
        onError={(e) => {
          // Если картинка не загрузилась, ставим дефолтную
          (e.currentTarget as HTMLImageElement).src = defaultImage;
        }}
      />

      <div className="content">
        <div className="product-title">{product.Title || "Без названия"}</div>
        <div className="product-specs">
          {product.Description || product.Efficiency || "Описание недоступно"}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Link className="product-button" to={`/heater/${product.ID}`}>
            Подробнее
          </Link>
          <button
            className="product-button"
            onClick={() => onAddToCart(product)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
