import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ChatBubbleLeftRightIcon, ClockIcon, EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/16/solid";
import { FaInstagram } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";
import { GrYoutube } from "react-icons/gr";

const ADMIN_EMAIL = "admin@admin.uz";

export default function Header() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.pageYOffset;
      if (current > lastScroll) setShowHeader(false);
      else setShowHeader(true);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
      {/* Top info bar */}
      <div className="text-base-content bg-base-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-2 text-sm">
          <div className="flex gap-5">
            <a href="tel:+998901234567" className="flex items-center gap-1 hover:text-blue-600">
              <PhoneIcon className="w-4 h-4" />
              <span>(90) 1234567</span>
            </a>
            <a href="mailto:rishton@tech.uz" className="flex items-center gap-1 hover:text-blue-600">
              <EnvelopeIcon className="w-4 h-4" />
              <span>rishton@tech.uz</span>
            </a>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>Ish vaqti: 8:00 - 18:00</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="#" className="bg-white p-1 rounded">
                <SiTelegram className="w-4 h-4 hover:text-blue-600" />
              </a>
              <a href="#" className="bg-white p-1 rounded">
                <FaInstagram className="w-4 h-4 hover:text-blue-600" />
              </a>
              <a href="#" className="bg-white p-1 rounded">
                <GrYoutube className="w-4 h-4 hover:text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="w-full shadow-sm bg-base-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-5">
          <div>
            <Link to="/" className="text-2xl font-medium">
              RishtonTech
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/" className="link link-hover">
              Bosh sahifa
            </Link>
            <Link to="/about" className="link link-hover">
              Haqida
            </Link>
            {isAdmin && (
              <Link to="/admin" className="link link-hover">
                Admin
              </Link>
            )}
            <Link to="/chat" className="link link-hover flex items-center gap-1">
              Izohlar
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
            </Link>

            {!user ? (
              <Link to="/auth" className="btn btn-primary gap-1">
                Kirish <UserIcon className="w-4 h-4" />
              </Link>
            ) : (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-blue-700 text-white w-8 h-8 flex items-center justify-center">
                    <span>{user.displayName ? user.displayName[0].toUpperCase() : "U"}</span>
                  </div>
                </button>
                <ul tabIndex={0} className="menu menu-md dropdown-content bg-base-100 rounded-box w-52 p-2 shadow mt-3">
                  <li>
                    <span>{user.displayName}</span>
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
    </div>
  );
}
