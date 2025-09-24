import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminChat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [ads, setAds] = useState({}); // adId -> title map
  const [categoryNames, setCategoryNames] = useState({}); // chatId -> categoryName map

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth");
      }
    });
    return () => unsub();
  }, [navigate]);

  // E’lonlar ro‘yxati
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

  // Chats ma’lumotlari
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const snapshot = await getDocs(collection(db, "chats"));
        const filteredChats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((c) => c.messages?.length > 0);

        // Kategoriya chatlarini aniqlash
        const catNames = {};
        filteredChats.forEach((chat) => {
          if (chat.id.startsWith("category-")) {
            const name = chat.id.replace("category-", "");
            catNames[chat.id] = name.charAt(0).toUpperCase() + name.slice(1);
          }
        });

        setCategoryNames(catNames);
        setChats(filteredChats);
      } catch (err) {
        console.error("Chats fetch error:", err);
      }
    };
    fetchChats();
  }, []);

  if (!user) return <p>Loading...</p>;
  if (!chats.length) return <p>Sizda chatlar yo‘q</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Barcha Chatlar</h2>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => {
          const adTitle = ads[chat.id] || categoryNames[chat.id] || "Noma’lum e’lon";
          return (
            <div key={chat.id} className="p-2 border rounded cursor-pointer hover:bg-gray-100">
              <strong>E’lon nomi:</strong> {adTitle} <br />
              <strong>Xabarlar soni:</strong> {chat.messages?.length || 0}
            </div>
          );
        })}
      </div>
    </div>
  );
}
