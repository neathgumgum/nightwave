import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import DashboardComponent from "../components/DashboardComponent";
import { products as initialProducts } from "../data/products";

export default function AdminPortalPage() {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [message, setMessage] = useState("");

  const saveProduct = async (product) => {
    try {
      await setDoc(doc(db, "products", product.id), { ...product, updatedAt: serverTimestamp() });
      setProducts((current) => {
        const exists = current.some((p) => p.id === product.id);
        if (exists) return current.map((p) => (p.id === product.id ? product : p));
        return [product, ...current];
      });
      setMessage("Product saved to Firestore.");
    } catch (error) {
      setMessage(`Firestore error: ${error.message}`);
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("Delete this product? This can't be undone.");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((current) => current.filter((p) => p.id !== id));
      setMessage("Product deleted.");
    } catch (error) {
      setMessage(`Delete error: ${error.message}`);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 lg:flex-row">
      <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-3 lg:w-60">
        <p className="px-3 py-3 text-xs font-bold uppercase tracking-[0.25em] text-sky-400">Admin Portal</p>
        {["dashboard", "products", "orders", "users"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`w-full rounded-xl px-3 py-3 text-left capitalize ${
              tab === item ? "bg-sky-400 font-bold text-slate-950" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            {item}
          </button>
        ))}
      </aside>

      <section className="min-w-0 flex-1">
        {message && (
          <div className="mb-6 rounded-xl border border-sky-400/20 bg-sky-400/10 p-3 text-sm text-sky-200">{message}</div>
        )}

        {tab === "dashboard" && <DashboardComponent products={products} />}
        {tab === "products" && <ProductManager products={products} onSave={saveProduct} onDelete={deleteProduct} />}
        {tab === "orders" && <OrdersManager />}
        {tab === "users" && <UsersManager />}
      </section>
    </main>
  );
}

function ProductManager({ products, onSave, onDelete }) {
  const emptyForm = { id: "", name: "", category: "AirPods", price: "", description: "", image: "/images/placeholder.svg", badge: "New" };
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");

    const price = Number(form.price);
    if (!form.id.trim() || !form.name.trim()) {
      setFormError("Product ID and name are required.");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setFormError("Price must be a non-negative number.");
      return;
    }

    await onSave({ ...form, price });
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Management</p>
        <h1 className="mt-2 text-3xl font-black">Products</h1>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-2">
        {formError && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300 md:col-span-2">{formError}</div>
        )}

        <Input label="Product ID" required value={form.id} onChange={(value) => setForm({ ...form, id: value })} />
        <Input label="Product name" required value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Input label="Price" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
        <Input label="Image path" value={form.image} onChange={(value) => setForm({ ...form, image: value })} />
        <Input label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />

        <label>
          <span className="mb-2 block text-sm font-semibold">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0b1024] px-4 py-3"
          >
            <option>AirPods</option>
            <option>AirPods Pro</option>
            <option>AirPods Max</option>
          </select>
        </label>

        <button className="rounded-xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300">Save Product</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-white/10 text-slate-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/5">
                <td className="p-4 font-semibold">{product.name}</td>
                <td className="p-4 text-slate-400">{product.category}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">
                  <button onClick={() => onDelete(product.id)} className="rounded-lg border border-red-400/20 px-3 py-2 text-red-300 hover:bg-red-400/10">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, required = false }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-sky-400" />
    </label>
  );
}

const STATUSES = ["pending", "shipped", "completed", "cancelled"];

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Fulfillment</p>
        <h1 className="mt-2 text-3xl font-black">Orders</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading orders…</p>
      ) : !orders.length ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{order.userEmail || "Unknown customer"}</p>
                  <p className="text-xs text-slate-500">Order #{order.id.slice(0, 8)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-black">${Number(order.total || 0).toFixed(2)}</span>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#0b1024] px-3 py-2 text-sm capitalize"
                  >
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-slate-400">
                {(order.items || []).map((item) => (
                  <li key={item.id}>{item.qty}× {item.name} — ${(item.qty * item.price).toFixed(2)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setUsers(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Accounts</p>
        <h1 className="mt-2 text-3xl font-black">Users</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading users…</p>
      ) : !users.length ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
          No registered users yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="p-4 font-semibold">{u.name || "—"}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Panel({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-400">{text}</p>
    </div>
  );
}