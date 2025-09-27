import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [categoryData, setCategoryData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Auth state
  useEffect(() => auth.onAuthStateChanged(setCurrentUser), []);

  // Fetch category data and ads
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);

      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const category = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).find((cat) => cat.name?.toLowerCase() === categoryName?.toLowerCase());

        if (!category) return;

        setCategoryData(category);

        // Filter out falsy subcategories (like "0", null, "")
        if (category.sub) {
          setSubCategories(category.sub.filter((sub) => sub && sub !== "0"));
        }

        const adsQuery = query(collection(db, "ads"), where("category", "==", categoryName.toLowerCase()));
        const adsSnapshot = await getDocs(adsQuery);

        const adsData = adsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllAds(adsData);
        setAds(adsData);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  // Filter ads by selected subcategory
  useEffect(() => {
    if (!selectedSubCategory) {
      setAds(allAds);
    } else {
      setAds(allAds.filter((ad) => ad.subCategory && ad.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()));
    }
  }, [selectedSubCategory, allAds]);

  // Chat button
  const handleGoToChat = () => {
    if (!currentUser) {
      navigate(`/auth?redirect=/chat/category-${categoryName.toLowerCase()}`);
      return;
    }
    navigate(`/chat/category-${categoryName.toLowerCase()}`);
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  const showSubCategories = allAds.length && subCategories.length;

  return (
    <div className="max-w-6xl mx-auto my-36">
      {/* CATEGORY INFO */}
      {categoryData && (
        <div className="bg-gray-100 p-5 rounded shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-2">{categoryData.name}</h2>
          {categoryData.description && <p className="mb-3 whitespace-pre-line">{categoryData.description}</p>}
          {categoryData.phone && <p className="font-semibold">Aloqa: {categoryData.phone}</p>}

          <button onClick={handleGoToChat} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Izoh qoldirish
          </button>
        </div>
      )}

      {/* SUB CATEGORIES */}
      {showSubCategories && (
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSelectedSubCategory("")} className={`px-3 py-1 rounded border ${selectedSubCategory === "" ? "bg-blue-500 text-white" : ""}`}>
            Barchasi
          </button>

          {subCategories.map((sub, i) => (
            <button key={i} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded border ${selectedSubCategory === sub ? "bg-blue-500 text-white" : ""}`}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* ADS LIST */}
      <ul className="flex flex-col gap-3">
        {ads.map((ad) => (
          <li key={ad.id} className="bg-white p-3 rounded flex gap-3 items-start shadow">
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
    </div>
  );
}
