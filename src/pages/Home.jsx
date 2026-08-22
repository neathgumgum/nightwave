import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-400">
              Next-generation wireless audio
            </p>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
              Experience Sound
              <span className="block bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                Beyond Limits.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Premium wireless audio designed for music, gaming, calls, travel, and every moment between.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-sky-400 px-7 py-3 font-black text-slate-950 hover:bg-sky-300">
                Shop Now →
              </Link>
              <Link to="/about" className="rounded-full border border-white/15 px-7 py-3 font-bold hover:border-sky-400">
                Explore NightWave
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute h-[400px] w-[400px] rounded-full bg-sky-400/15 blur-3xl" />
            <div className="relative text-center">
              <img
                src="/images/airpods-max/Airpods-Max-LightBlue.png"
                alt="NightWave headphones"
                className="mx-auto h-130 w-120 object-contain"
              />
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.35em] text-sky-300">NightWave Audio</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Curated for you</p>
          <h2 className="mt-2 text-4xl font-black">Featured Products</h2>
        </div>
        <ProductGrid items={products.slice(0, 3)} />
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Why NightWave?</p>
            <h2 className="mt-3 text-4xl font-black">Built Around Your Sound</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Immersive Audio", "Clear highs, deep lows, and a sound profile designed for everyday listening."],
              ["02", "Modern Comfort", "Lightweight materials and thoughtful ergonomics for long sessions."],
              ["03", "Reliable Support", "Secure checkout, responsive service, and a one-year store warranty."],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-3xl border border-white/10 p-7">
                <span className="text-sm font-black text-sky-400">{num}</span>
                <h3 className="mt-5 text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
