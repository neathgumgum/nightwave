import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nightwave_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...current, { id: product.id, name: product.name, price: product.price, image: product.image, qty }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}