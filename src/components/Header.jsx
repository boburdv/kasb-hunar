import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const auth = getAuth();
  const navigate = useNavigate();
  const ADMIN_EMAIL = "admin@store.uz";

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center flex-wrap">
      <h1 className="font-bold text-xl">Rishton tumani 1-sonli politexnikum</h1>

      <nav className="flex items-center gap-4 flex-wrap">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {isAdmin && (
          <Link to="/admin" className="hover:underline">
            E’lon qo‘shish
          </Link>
        )}

        {user && (
          <Link to="/chat" className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200">
            Chat
          </Link>
        )}

        {user && <span className="ml-2">{user.email}</span>}

        {!user ? (
          <Link to="/auth" className="bg-green-400 px-3 py-1 rounded hover:bg-green-500">
            Login
          </Link>
        ) : (
          <button onClick={handleLogout} className="bg-red-400 px-3 py-1 rounded hover:bg-red-500">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
