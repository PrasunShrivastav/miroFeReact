// Shared cart logic.
// In a real project this would be a shared npm package
// (like the reference tutorial's "@microshop/cart-contract").
// Here we duplicate this tiny file in products/ and cart/
// so each app works standalone AND together.
// Communication = localStorage (data) + window CustomEvent (notification).

export const CART_KEY = "mfe-cart";
export const CART_EVENT = "cart-updated";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Tell every app on this page (host + remotes) that cart changed
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(product) {
  const items = getCart();
  const existing = items.find((i) => i.id === product.id);
  const next = existing
    ? items.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      )
    : [...items, { ...product, qty: 1 }];
  saveCart(next);
}

export function removeFromCart(id) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function clearCart() {
  saveCart([]);
}
