import { Navigate, useLocation } from "react-router-dom";

// Guards a route behind login, and optionally behind the admin custom claim.
// `authChecked` prevents a flash-redirect to /login while Firebase is still
// resolving the auth state and the admin claim on first load/refresh.
export default function ProtectedRoute({ user, isAdmin, authChecked, requireAdmin = false, children }) {
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-400">
        Checking access…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="text-3xl font-black">Not authorized</h1>
        <p className="mt-3 text-slate-400">
          Your account doesn't have admin access to this page.
        </p>
      </div>
    );
  }

  return children;
}
