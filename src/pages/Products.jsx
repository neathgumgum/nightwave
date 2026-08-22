import { useMemo, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

export default function Products() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "AirPods", "AirPods Pro", "AirPods Max"];

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const textMatch = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && textMatch;
    });
  }, [query, category]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Store</p>
      <h1 className="mt-3 text-5xl font-black">All Products</h1>
      <p className="mt-5 max-w-2xl leading-7 text-slate-400">
        Explore the NightWave collection and find the right audio experience.
      </p>

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-sky-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
        >
          {categories.map((item) => (<option key={item}>{item}</option>))}
        </select>
      </div>

      <div className="mt-10">
        <ProductGrid items={filtered} />
      </div>
    </main>
  );
}
