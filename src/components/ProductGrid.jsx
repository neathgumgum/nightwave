import ProductCard from "./ProductCard";

export default function ProductGrid({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 p-12 text-center text-slate-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
