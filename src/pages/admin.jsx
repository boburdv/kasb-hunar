import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ADMIN_EMAIL = "admin@admin.uz";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/auth", { replace: true });
      } else {
        setUser(currentUser);
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    getDocs(collection(db, "categories")).then((snapshot) => setCategories(snapshot.docs.map((doc) => doc.data())));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !subCategory || !price) return setMessage("Barcha maydonlarni to‘ldiring!");

    const finalImageURL = image ? await getDownloadURL(await uploadBytes(ref(storage, `ads/${Date.now()}_${image.name}`), image)) : imageLink;

    await addDoc(collection(db, "ads"), {
      title,
      description,
      price,
      imageURL: finalImageURL,
      category: category.toLowerCase(),
      subCategory: subCategory.toLowerCase(),
      createdAt: serverTimestamp(),
    });

    setMessage("E’lon muvaffaqiyatli qo‘shildi!");
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setSubCategory("");
    setImage(null);
    setImageLink("");
  };

  if (!user) return null; // user hali set bo'lmasa hech narsani ko'rsatmaymiz

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">E’lon qo‘shish (Admin)</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <input type="text" placeholder="E’lon nomi" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Tafsifi" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Narxi" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border p-2 rounded" />
        <input type="text" placeholder="Rasm linki" value={imageLink} onChange={(e) => setImageLink(e.target.value)} className="border p-2 rounded" />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("");
          }}
          className="border p-2 rounded"
        >
          <option value="">Kategoriya tanlang</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="border p-2 rounded" disabled={!category}>
          <option value="">Subkategoriya tanlang</option>
          {category &&
            categories
              .find((cat) => cat.name === category)
              ?.sub?.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
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
