import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

export default function AirPods() {
  const items = products.filter((product) => product.category === "AirPods");
  return (
    <main className="mx-auto max-w-7xl px-5 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-400">AirPods</p>
      <h1 className="mt-3 text-5xl font-black">Light. Wireless. Effortless.</h1>
      <p className="mt-5 mb-12 max-w-3xl text-lg leading-8 text-slate-400">
        Everyday wireless audio with a comfortable fit and clean, balanced sound.
      </p>
      <ProductGrid items={items} />
    </main>
  );
}
