import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./components/Category";
import AdminPanel from "./pages/Admin";
import AdDetail from "./components/AdDetail";
import Chat from "./pages/Chat";
import AllChats from "./pages/AllChats";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <main className="flex-1 p-4">
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
        <Footer />
      </div>
    </Router>
  );
}
