import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminChat() {
  const [chats, setChats] = useState([]);
  const [ads, setAds] = useState({});
  const navigate = useNavigate();

  // Ads ma’lumotlarini olish
  useEffect(() => {
    const fetchAds = async () => {
      const snapshot = await getDocs(collection(db, "ads"));
      const adsMap = {};
      snapshot.docs.forEach((doc) => {
        adsMap[doc.id] = doc.data().title; // adId => adTitle
      });
      setAds(adsMap);
    };
    fetchAds();
  }, []);

  // Chats ma’lumotlarini olish
  useEffect(() => {
    const fetchChats = async () => {
      const snapshot = await getDocs(collection(db, "chats"));
      const filteredChats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((c) => c.messages?.length > 0);
      setChats(filteredChats);
    };
    fetchChats();
  }, []);

  if (!chats.length) return <p>Sizda chatlar yo‘q</p>;

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
