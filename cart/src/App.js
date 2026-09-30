import React from "react";
import CartList from "./CartList";

// Standalone mode: when you open localhost:3002 directly,
// you see the cart app by itself.
export default function App() {
  return (
    <div>
      <h1 style={{ padding: "10px 20px" }}>Cart MFE (standalone)</h1>
      <CartList />
    </div>
  );
}
