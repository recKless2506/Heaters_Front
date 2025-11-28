import React, { useMemo } from "react";
import Header from "../components/Header";
import CartIcon from "../components/CartIcon";
import ProductCard from "../components/ProductCard";
import type { HeaterProduct } from "../types";
import "./catalog.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setSearch } from "../store/filterSlice";

type Props = {
  products: HeaterProduct[];
  cartCount: number;
  onAddToCart: (p: HeaterProduct) => void;
};

const CatalogPage: React.FC<Props> = ({ products, cartCount, onAddToCart }) => {
  const search = useSelector((state: RootState) => state.filters.search);
  const dispatch = useDispatch();

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.Title.toLowerCase().includes(q) ||
          (p.Description ?? "").toLowerCase().includes(q) ||
          (p.Power ?? "").toLowerCase().includes(q)
        );
      }),
    [products, search]
  );

  return (
    <div className="catalog-page">
      <Header cartCount={cartCount} />

      {/* Поиск и иконка корзины сразу под хедером */}
      <div className="catalog-top">
        <div className="catalog-search">
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>
        <CartIcon count={cartCount} />
      </div>

      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.ID}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", marginTop: 40 }}>
            Товары не найдены по запросу "{search}".
          </p>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
