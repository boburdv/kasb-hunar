import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./components/Category";
import AdminPanel from "./pages/admin";
import AdDetail from "./components/AdDetail";
import Chat from "./pages/Chat";
import AdminChat from "./pages/admin-chat";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:categoryName" element={<CategoryPage />} />
            <Route path="/ad/:adId" element={<AdDetail />} />
            <Route path="/chat/:adId" element={<Chat />} />
            <Route path="/chat" element={<AdminChat />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
