import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./components/Category";
import AdminPanel from "./pages/Admin";
import AdDetail from "./components/AdDetail";
import Chat from "./pages/Chat";
import AllChats from "./pages/AllChats";
import Auth from "./pages/Auth";

function AppWrapper() {
  const location = useLocation();

  const noLayoutRoutes = ["/auth", "/chat"];
  const hideLayout = noLayoutRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:categoryName" element={<CategoryPage />} />
          <Route path="/:categoryName/:subName" element={<CategoryPage />} />
          <Route path="/ad/:adId" element={<AdDetail />} />
          <Route path="/chat" element={<AllChats />} />
          <Route path="/chat/:adId" element={<Chat />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
