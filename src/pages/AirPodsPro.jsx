import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

export default function AirPodsPro() {
  const items = products.filter((product) => product.category === "AirPods Pro");
  return (
    <main className="mx-auto max-w-7xl px-5 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-400">AirPods Pro</p>
      <h1 className="mt-3 text-5xl font-black">Silence the Noise.</h1>
      <p className="mt-5 mb-12 max-w-3xl text-lg leading-8 text-slate-400">
        Pro-level wireless listening for focused work, travel, workouts, and music.
      </p>
      <ProductGrid items={items} />
    </main>
  );
}
