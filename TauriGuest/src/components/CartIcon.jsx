import React from "react";
import { useNavigate } from "react-router-dom";
import "./carticon.css";
import { useSelector } from "react-redux";

const CartIcon = () => {
  const navigate = useNavigate();
  const draft = useSelector((state) => state.requests.draft);
  const count = draft ? (draft.requestHeaters?.length || draft.RequestHeaters?.length || 0) : 0;
  const isDisabled = count <= 0;

  const handleClick = () => {
    if (isDisabled) return;
    navigate("/heaters-cart");
  };

  return (
    <div
      className={`cart-icon-wrapper ${isDisabled ? "cart-icon-wrapper--disabled" : ""}`}
      title="Корзина"
      onClick={handleClick}
    >
      <div className={`cart-icon ${isDisabled ? "cart-icon--disabled" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#0567B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" fill="#0567B7" />
          <circle cx="20" cy="21" r="1" fill="#0567B7" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && <div className="cart-count">{count}</div>}
      </div>
    </div>
  );
};

export default CartIcon;


