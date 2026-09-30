import React from "react";
import ProductsList from "./ProductsList";

// Standalone mode: when you open localhost:3001 directly,
// you see the products app by itself.
export default function App() {
  return (
    <div>
      <h1 style={{ padding: "10px 20px" }}>Products MFE (standalone)</h1>
      <ProductsList />
    </div>
  );
}
