import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminChat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Foydalanuvchi holatini saqlash
  const [chats, setChats] = useState([]);
  const [ads, setAds] = useState({});

  // 🔥 Foydalanuvchi tizimga kirganligini tekshirish
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Tizimga kirgan foydalanuvchi
      } else {
        navigate("/auth"); // Tizimga kirmagan foydalanuvchi
      }
    });
    return () => unsub();
  }, [navigate]);

  // 🔥 E’lonlar ro‘yxatini olish
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const snapshot = await getDocs(collection(db, "ads"));
        const adsMap = {};
        snapshot.docs.forEach((doc) => {
          adsMap[doc.id] = doc.data().title;
        });
        setAds(adsMap);
      } catch (err) {
        console.error("Ads fetch error:", err);
      }
    };
    fetchAds();
  }, []);

  // 🔥 Chats ma’lumotlarini olish
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const snapshot = await getDocs(collection(db, "chats"));
        const filteredChats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((c) => c.messages?.length > 0);
        setChats(filteredChats);
      } catch (err) {
        console.error("Chats fetch error:", err);
      }
    };
    fetchChats();
  }, []);

  // 🔥 Loading holati va chatlar bo‘lmasa
  if (!user) return <p>Loading...</p>; // Foydalanuvchi tizimga kirganini kutamiz
  if (!chats.length) return <p>Sizda chatlar yo‘q</p>; // Chatlar mavjud bo‘lmasa

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Barcha Chatlar</h2>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <div key={chat.id} className="p-2 border rounded cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/chat/${chat.id}`)}>
            <strong>E’lon nomi:</strong> {ads[chat.id] || "Noma’lum e’lon"} <br />
            <strong>Xabarlar soni:</strong> {chat.messages?.length || 0}
          </div>
        ))}
      </div>
    </div>
  );
}
