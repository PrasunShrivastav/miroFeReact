import React, { Suspense, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CART_EVENT, getCart } from "./cartStoreHost";

// Dynamic remote imports — these are NOT in host's bundle.
// Webpack downloads them at runtime from the remoteEntry.js files.
const ProductsList = React.lazy(() => import("products/ProductsList"));
const CartList = React.lazy(() => import("cart/CartList"));

function Navbar({ count }) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: 12,
        background: "#222",
        color: "#fff",
      }}
    >
      <strong>Microfrontend Host</strong>
      <Link to="/products" style={{ color: "#fff" }}>
        Products
      </Link>
      <Link to="/cart" style={{ color: "#fff" }}>
        Cart ({count})
      </Link>
    </nav>
  );
}

export default function App() {
  const [count, setCount] = useState(() =>
    getCart().reduce((s, i) => s + i.qty, 0)
  );

  useEffect(() => {
    const refresh = () =>
      setCount(getCart().reduce((s, i) => s + i.qty, 0));
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div>
      <Navbar count={count} />
      <Suspense fallback={<p style={{ padding: 20 }}>Loading remote...</p>}>
        <Routes>
          <Route path="/" element={<p style={{ padding: 20 }}>Go to Products or Cart.</p>} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/cart" element={<CartList />} />
        </Routes>
      </Suspense>
    </div>
  );
}
