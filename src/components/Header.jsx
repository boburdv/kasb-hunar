import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ChatBubbleLeftRightIcon, ClockIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/16/solid";
// import { FaFacebookF, FaInstagram, FaTelegramPlane, FaYoutube } from "react-icons/fa";

const ADMIN_EMAIL = "admin@admin.uz";

export default function Header() {
  const auth = getAuth();
  const navigate = useNavigate();
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
    <>
      <div className="bg-gray-100 text-sm font-medium">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-2">
          {/* Chap tomon: telefon va email */}
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-4 h-4" />
              <span>+998 (90) 1234567</span>
            </div>
            <div className="flex items-center gap-1">
              <EnvelopeIcon className="w-4 h-4" />
              <span>rishton@tech.uz</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>Ish vaqti: 8:00 - 18:00</span>
            </div>
            {/* <div className="flex items-center gap-3">
              <a href="#" className="text-blue-500">
                <FaTelegramPlane className="w-4 h-4" />
              </a>
              <a href="#" className="text-pink-500">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-red-600">
                <FaYoutube className="w-4 h-4" />
              </a>
              <a href="#" className="text-blue-700">
                <FaFacebookF className="w-4 h-4" />
              </a>
            </div> */}
          </div>
        </div>
      </div>

      <header className="w-full shadow-sm bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
          {/* Logo */}
          <div>
            <Link to="/" className="text-2xl font-medium text-gray-800">
              RishtonTech
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex items-center gap-7">
            <Link to="/" className="">
              Asosiy
            </Link>
            <Link to="/" className="">
              Haqida
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 ">
                Admin
              </Link>
            )}
            <Link to="/chat" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
              Izohlar
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
            </Link>

            {!user ? (
              <Link to="/auth">Kirish</Link>
            ) : (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-neutral text-white w-8 h-8 flex items-center justify-center">
                    <span className="text-lg font-bold">{user.displayName ? user.displayName[0].toUpperCase() : "U"}</span>
                  </div>
                </button>
                <ul tabIndex={0} className="menu menu-md dropdown-content bg-base-100 rounded-box w-52 p-2 shadow mt-3">
                  <li>
                    <span className="justify-between">{user.displayName}</span>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Hisobdan chiqish</button>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
