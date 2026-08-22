import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });

      // Firebase's client SDK can't list registered users (that needs the
      // Admin SDK, server-side). So the admin panel's Users tab reads from
      // this Firestore record instead — written once, right here, at signup.
      await setDoc(doc(db, "users", result.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      // New accounts are regular customers by default — admin access is
      // granted separately (see ADMIN_EMAILS in App.jsx), never at signup.
      navigate("/", { replace: true });
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
          <h1 className="mt-5 text-3xl font-black">Create your account.</h1>
          <p className="mt-2 text-sm text-slate-400">Join the NightWave experience.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
          )}

          <Input label="Full name" value={name} onChange={setName} />
          <Input label="Email" type="email" value={email} onChange={setEmail} />
          <Input label="Password" type="password" value={password} onChange={setPassword} />
          <Input label="Confirm password" type="password" value={confirm} onChange={setConfirm} />

          <button disabled={busy} className="w-full rounded-xl bg-sky-400 py-3 font-black text-slate-950 hover:bg-sky-300 disabled:opacity-50">
            {busy ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already registered?
            <Link to="/login" className="ml-1 font-bold text-sky-300">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-sky-400" />
    </label>
  );
}