import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-2 hover:border-sky-400/30">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 p-8">
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-300">
          {product.badge}
        </span>
        <img
          src={product.image}
          alt={product.name}
          className="h-full max-w-full object-contain transition duration-500 group-hover:scale-110"
          onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
        />
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-sky-400">{product.category}</p>
        <h3 className="mt-2 text-xl font-bold">{product.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-black">${product.price}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 rounded-full border border-white/15 px-4 py-2 text-sm font-bold hover:border-sky-400"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-sky-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
