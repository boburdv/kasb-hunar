import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [allAds, setAllAds] = useState([]);
  const [ads, setAds] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Foydalanuvchi holatini tekshirish
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  // 🔹 Kategoriya ma’lumotlari va e’lonlarni olish
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const categoryData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());

        if (!categoryData) return;

        if (categoryData?.info) setCategoryInfo(categoryData.info);
        if (categoryData?.sub) setSubCategories(categoryData.sub);

        // Barcha kategoriyaga tegishli e’lonlarni olish
        const adsQuery = query(collection(db, "ads"), where("category", "==", categoryName.toLowerCase()));
        const adsSnapshot = await getDocs(adsQuery);
        const adsData = adsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllAds(adsData);
        setAds(adsData);
      } catch (error) {
        console.error("Kategoriya ma'lumotini olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryName]);

  // 🔹 Subkategoriya filter
  useEffect(() => {
    if (selectedSubCategory === "") {
      setAds(allAds);
    } else {
      const filtered = allAds.filter((ad) => ad.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase());
      setAds(filtered);
    }
  }, [selectedSubCategory, allAds]);

  // 🔹 Xabar yuborish tugmasi
  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate(`/auth?redirect=/category/${categoryName}`);
      return;
    }

    const chatRef = doc(db, "chats", `category-${categoryName.toLowerCase()}`);
    const newMsg = {
      sender: currentUser.email,
      text: `Foydalanuvchi kategoriya: ${categoryName} orqali xabar yubordi.`,
      createdAt: Date.now(),
    };

    try {
      const docSnap = await getDoc(chatRef);
      if (!docSnap.exists()) {
        await setDoc(chatRef, { messages: [newMsg] });
      } else {
        await updateDoc(chatRef, { messages: arrayUnion(newMsg) });
      }
      alert("Xabar yuborildi!");
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
      alert("Xabar yuborishda xatolik yuz berdi");
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  const showSubCategories = allAds.length > 0 && subCategories.length > 0;

  return (
    <div>
      {categoryInfo && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h2 className="text-2xl font-bold mb-2">{categoryName}</h2>
          {categoryInfo.description && <p>Ta’rif: {categoryInfo.description}</p>}
          {categoryInfo.phone && <p>Telefon: {categoryInfo.phone}</p>}

          {/* 🔹 Xabar yuborish tugmasi */}
          <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Xabar yuborish
          </button>
        </div>
      )}

      {/* 🔹 Subkategoriya tugmalari filter sifatida */}
      {showSubCategories && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setSelectedSubCategory("")} className={`px-3 py-1 rounded border ${selectedSubCategory === "" ? "bg-blue-500 text-white" : ""}`}>
            Barchasi
          </button>
          {subCategories.map((sub, index) => (
            <button key={index} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded border ${selectedSubCategory === sub ? "bg-blue-500 text-white" : ""}`}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {ads.length === 0 ? (
        <p>Hozircha e'lonlar yo'q.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ads.map((ad) => (
            <li key={ad.id} className="bg-white p-3 rounded flex gap-3 items-start">
              {ad.imageURL && <img src={ad.imageURL} alt={ad.title} className="w-32 h-32 object-cover rounded" />}
              <div>
                <Link to={`/ad/${ad.id}`}>
                  <h3 className="font-bold text-lg hover:text-blue-600">{ad.title}</h3>
                </Link>
                {ad.price && <p className="text-green-600 font-semibold">{ad.price} so'm</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
