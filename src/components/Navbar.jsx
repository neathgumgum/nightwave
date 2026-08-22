import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const links = [
  ["/", "Home"],
  ["/products", "Products"],
  ["/airpods", "AirPods"],
  ["/airpods-pro", "AirPods Pro"],
  ["/airpods-max", "AirPods Max"],
  ["/about", "About Us"],
];

export default function Navbar({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  const navClass = ({ isActive }) =>
    `transition hover:text-sky-300 ${isActive ? "text-sky-400" : "text-slate-300"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <img src="/images/logo.png" alt="NightWave logo" className="h-9 w-9 rounded-xl object-cover" />
          <span className="text-lg font-black tracking-[0.18em]">NIGHTWAVE</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={navClass}>{label}</NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/cart" className="relative rounded-full border border-white/10 px-4 py-2 text-sm hover:border-sky-400">
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-sky-400 text-xs font-bold text-slate-950">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="rounded-full border border-white/10 px-4 py-2 text-sm hover:border-sky-400">Admin</Link>
              )}
              <button onClick={onLogout} className="rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-sky-300">Logout</button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-sky-300">Login</Link>
          )}
        </div>

        <button className="rounded-lg border border-white/10 px-3 py-2 text-xl lg:hidden" onClick={() => setOpen(!open)}>
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#080c1c] px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5 hover:text-sky-300">
                {label}
              </NavLink>
            ))}

            <Link to="/cart" onClick={() => setOpen(false)} className="px-3 py-3 text-slate-300 hover:text-sky-300">
              Cart{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="px-3 py-3 text-sky-300">Admin Portal</Link>
                )}
                <button onClick={onLogout} className="px-3 py-3 text-left text-red-300">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-3 text-sky-300">Login / Register</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
