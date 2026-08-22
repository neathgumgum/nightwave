import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050e]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-xl font-black tracking-[0.2em]">NIGHTWAVE</div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Premium wireless audio for people who want music, calls, gaming, and everyday moments to feel more immersive.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Explore</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
            <Link to="/products">Products</Link>
            <Link to="/airpods">AirPods</Link>
            <Link to="/airpods-pro">AirPods Pro</Link>
            <Link to="/airpods-max">AirPods Max</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Company</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
            <Link to="/about">About Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © 2026 NightWave. All rights reserved.
      </div>
    </footer>
  );
}
