import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AllChats() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate("/auth");
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchChats = async () => {
      const snapshot = await getDocs(collection(db, "chats"));
      const allChats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const catNames = {};
      allChats.forEach((chat) => {
        if (chat.id.startsWith("category-")) {
          const name = chat.id.replace("category-", "");
          catNames[chat.id] = name.charAt(0).toUpperCase() + name.slice(1);
        }
      });

      setCategoryNames(catNames);
      setChats(allChats);
    };
    fetchChats();
  }, []);

  if (!user) return <p>Loading...</p>;
  if (!chats.length) return <p>Hozircha chatlar mavjud emas</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Barcha Chatlar</h2>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => {
          const chatTitle = categoryNames[chat.id] || chat.id;
          return (
            <div key={chat.id} className="p-2 border rounded cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/chat/${chat.id}`)}>
              <strong>Chat nomi:</strong> {chatTitle} <br />
              <strong>Xabarlar soni:</strong> {chat.messages?.length || 0}
            </div>
          );
        })}
      </div>
    </div>
  );
}
