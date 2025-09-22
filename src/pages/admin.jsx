import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@store.uz";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        navigate("/auth");
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      setCategories(snapshot.docs.map((doc) => doc.data().name));
    };
    fetchCategories();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !price) return setMessage("Barcha maydonlarni to‘ldiring!");
    let imageURL = "";
    if (image) {
      const storageRef = ref(storage, `ads/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageURL = await getDownloadURL(storageRef);
    }
    await addDoc(collection(db, "ads"), { title, description, price, imageURL, category: category.toLowerCase(), createdAt: serverTimestamp() });
    setMessage("E’lon muvaffaqiyatli qo‘shildi!");
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage(null);
  };

  if (!user) {
    return (
      <form onSubmit={handleLogin} className="max-w-xl mx-auto p-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Kirish
        </button>
      </form>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">E’lon qo‘shish (Admin)</h2>
      </div>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <input type="text" placeholder="E’lon nomi" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Tafsifi" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Narxi" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border p-2 rounded" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="">Kategoriya tanlang</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Qo‘shish
        </button>
      </form>
    </div>
  );
}
