import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

export default function AirPodsMax() {
  const items = products.filter((product) => product.category === "AirPods Max");
  return (
    <main className="mx-auto max-w-7xl px-5 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-400">AirPods Max</p>
      <h1 className="mt-3 text-5xl font-black">Sound. In Full Scale.</h1>
      <p className="mt-5 mb-12 max-w-3xl text-lg leading-8 text-slate-400">
        Premium over-ear listening with a spacious presentation and luxurious comfort.
      </p>
      <ProductGrid items={items} />
    </main>
  );
}
