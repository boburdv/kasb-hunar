import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Kasb-Hunar</h1>
      <nav className="flex items-center gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/admin" className="hover:underline">
          Admin
        </Link>
        <Link to="/chat" className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200">
          Chat
        </Link>
      </nav>
    </header>
  );
}
