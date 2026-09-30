// Host only needs to READ the cart (for the navbar badge).
// Same key + event name as the remotes use.
export const CART_KEY = "mfe-cart";
export const CART_EVENT = "cart-updated";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
