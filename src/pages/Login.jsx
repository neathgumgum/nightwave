import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sky-400 font-black text-slate-950">N</div>
          <h1 className="mt-5 text-3xl font-black">Welcome back.</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue to NightWave.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-sky-400" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-sky-400" />
          </label>

          <button disabled={busy} className="w-full rounded-xl bg-sky-400 py-3 font-black text-slate-950 hover:bg-sky-300 disabled:opacity-50">
            {busy ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?
            <Link to="/register" className="ml-1 font-bold text-sky-300">Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
