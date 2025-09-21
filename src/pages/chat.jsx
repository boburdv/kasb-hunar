import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase/config";
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";

export default function Chat() {
  const { adId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  // Foydalanuvchi identifikatori (email yoki uid)
  const currentUserId = auth.currentUser?.email || auth.currentUser?.uid || "guest";

  useEffect(() => {
    const chatRef = doc(db, "chats", adId);

    // Chatni boshlash, agar mavjud bo‘lmasa yaratish
    const initChat = async () => {
      const snap = await getDoc(chatRef);
      if (!snap.exists()) await setDoc(chatRef, { messages: [] });
    };
    initChat();

    // Xabarlarni real-time olish
    const unsub = onSnapshot(chatRef, (snap) => {
      if (snap.exists()) setMessages(snap.data().messages || []);
    });

    return () => unsub();
  }, [adId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const chatRef = doc(db, "chats", adId);

    const newMsg = {
      sender: currentUserId,
      text,
      createdAt: Date.now(),
    };

    await updateDoc(chatRef, { messages: arrayUnion(newMsg) });
    setText("");
  };

  // Scroll avtomatik
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[80vh]">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {messages.length === 0 && <p>Sizda chatlar yo‘q</p>}
      <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
        {messages
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((msg, idx) => (
            <div key={idx} className={`p-2 rounded max-w-[70%] break-words ${msg.sender === currentUserId ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
              {msg.text}
            </div>
          ))}
        <div ref={scrollRef}></div>
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Xabar yozing..." className="border p-2 flex-1 rounded" onKeyDown={(e) => e.key === "Enter" && handleSend()} />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Yuborish
        </button>
      </div>
    </div>
  );
}
