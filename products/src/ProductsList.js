import React, { useState } from "react";
import { addToCart } from "./cartStore";

const PRODUCTS = [
  { id: "p1", name: "Wireless Mouse", price: 29 },
  { id: "p2", name: "Mechanical Keyboard", price: 89 },
  { id: "p3", name: "USB-C Hub", price: 45 },
  { id: "p4", name: "Monitor Stand", price: 39 },
];

export default function ProductsList() {
  const [msg, setMsg] = useState("");

  const handleAdd = (p) => {
    addToCart(p); // writes localStorage + fires window event
    setMsg(`Added "${p.name}" to cart`);
    setTimeout(() => setMsg(""), 1500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <div style={{ display: "grid", gap: 12, maxWidth: 500 }}>
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{p.name}</strong> — ${p.price}
            </span>
            <button onClick={() => handleAdd(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
