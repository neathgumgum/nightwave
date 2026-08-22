import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  const checkout = async () => {
    setError("");

    if (!auth.currentUser) {
      // Send them to login, remember to come back to /cart afterward.
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    setPlacing(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        items,
        total,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      clearCart();
      setPlaced(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-4xl font-black">Order placed!</h1>
        <p className="mt-4 text-slate-400">
          Thanks for shopping with NightWave. We'll be in touch about delivery.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 hover:bg-sky-300"
        >
          Keep browsing
        </Link>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-4xl font-black">Your cart is empty</h1>
        <p className="mt-4 text-slate-400">
          Add something from the store to get started.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 hover:bg-sky-300"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-black">Your Cart</h1>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-xl object-contain bg-black/20 p-2"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
            <div className="flex-1">
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-slate-400">${item.price} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateQty(item.id, Number(e.target.value))}
              className="w-16 rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-center outline-none focus:border-sky-400"
            />
            <span className="w-20 text-right font-bold">
              ${(item.qty * item.price).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-300 hover:text-red-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <span className="text-lg font-bold">Total</span>
        <span className="text-3xl font-black">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={checkout}
        disabled={placing}
        className="mt-6 w-full rounded-xl bg-sky-400 py-4 font-black text-slate-950 hover:bg-sky-300 disabled:opacity-50"
      >
        {placing ? "Placing order..." : "Checkout"}
      </button>
    </main>
  );
}
