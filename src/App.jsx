import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route } from "react-router-dom";

import { auth } from "./firebase/firebase";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import AirPods from "./pages/AirPods";
import AirPodsPro from "./pages/AirPodsPro";
import AirPodsMax from "./pages/AirPodsMax";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPortalPage from "./pages/AdminPortalPage";

const ADMIN_EMAILS = ["leangmunineath@gmail.com"]; // add every admin's email here

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
      } else {
        setIsAdmin(false);
      }

      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  if (!authChecked) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050816] text-white">
        Loading NightWave...
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar user={user} isAdmin={isAdmin} onLogout={() => signOut(auth)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/airpods" element={<AirPods />} />
          <Route path="/airpods-pro" element={<AirPodsPro />} />
          <Route path="/airpods-max" element={<AirPodsMax />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} isAdmin={isAdmin} authChecked={authChecked} requireAdmin>
                <AdminPortalPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="py-40 text-center text-4xl font-black">404</div>} />
        </Routes>

        <Footer />
      </div>
    </CartProvider>
  );
}