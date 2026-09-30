import React, { useEffect, useState } from "react";
import { CART_EVENT, clearCart, getCart, removeFromCart } from "./cartStore";

export default function CartList() {
  const [items, setItems] = useState(() => getCart());

  // Re-read cart whenever ANY app fires "cart-updated"
  useEffect(() => {
    const refresh = () => setItems(getCart());
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh); // cross-tab safety
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>Cart ({items.reduce((s, i) => s + i.qty, 0)} items)</h2>
      {items.length === 0 ? (
        <p>Cart is empty. Go to Products and add something.</p>
      ) : (
        <>
          <ul style={{ maxWidth: 500, padding: 0, listStyle: "none" }}>
            {items.map((i) => (
              <li
                key={i.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {i.name} × {i.qty} — ${i.price * i.qty}
                </span>
                <button onClick={() => {
                  removeFromCart(i.id);
                  setItems(getCart());
                }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: ${total}</strong>
          </p>
          <button
            onClick={() => {
              clearCart();
              setItems([]);
            }}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
