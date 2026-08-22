import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function DashboardComponent({ products }) {
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // onSnapshot (not getDocs) so the dashboard updates the moment a new
    // order or registration lands in Firestore — no tab switch or refresh needed.
    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((d) => d.data()));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUserCount(snapshot.size);
    });

    return () => {
      unsubOrders();
      unsubUsers();
    };
  }, []);

  const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const stats = [
    ["Products", String(products.length), "in catalog"],
    ["Orders", String(orders.length), "all time"],
    ["Customers", String(userCount), "registered"],
    ["Revenue", `$${revenue.toFixed(2)}`, "all time"],
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Overview</p>
        <h1 className="mt-2 text-3xl font-black">Dashboard</h1>
        <p className="mt-2 text-slate-400">Monitor NightWave store activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
            <p className="mt-2 text-xs text-emerald-400">{detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-xl font-bold">Recent Products</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="pb-3">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.id} className="border-b border-white/5">
                  <td className="py-4 font-semibold">{product.name}</td>
                  <td className="py-4 text-slate-400">{product.category}</td>
                  <td className="py-4">${product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}