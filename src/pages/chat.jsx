import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase/config";
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";

export default function Chat() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loading && !currentUser) navigate(`/auth?redirect=/chat/${adId}`);
  }, [loading, currentUser, adId, navigate]);

  const currentUserId = currentUser?.email;

  useEffect(() => {
    if (!currentUserId) return;
    const chatRef = doc(db, "chats", adId);

    (async () => {
      const snap = await getDoc(chatRef);
      if (!snap.exists()) {
        await setDoc(chatRef, { messages: [] });
      }
    })();

    const unsub = onSnapshot(chatRef, (snap) => {
      if (snap.exists()) {
        setMessages(snap.data().messages || []);
      }
    });

    return () => unsub();
  }, [adId, currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    const chatRef = doc(db, "chats", adId);
    const newMessage = { sender: currentUserId, text: trimmed, createdAt: Date.now() };
    await updateDoc(chatRef, {
      messages: [...messages, newMessage],
    });
  };

  if (loading) return <p>Loading...</p>;

  const chatName = adId.replace("category-", "").replace(/-/g, " ");

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[80vh]">
      <h2 className="text-2xl font-bold mb-4">{chatName} bo'yicha fikrlar</h2>
      <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
        {messages.map((msg, idx) => {
          const time = new Date(msg.createdAt).toLocaleTimeString();
          const isCurrentUser = msg.sender === currentUserId;
          return (
            <div key={idx} className={`flex items-start gap-2 max-w-[70%] ${isCurrentUser ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{msg.sender[0].toUpperCase()}</div>
              <div className={`p-2 rounded break-words ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p className="text-xs opacity-70">
                  {msg.sender} • <span className="text-gray-500">{time}</span>
                </p>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Xabar yozing..."
          className="border p-2 flex-1 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Yuborish
        </button>
      </div>
    </div>
  );
}
