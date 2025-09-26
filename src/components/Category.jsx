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
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => auth.onAuthStateChanged(setCurrentUser), []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const categoryData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());

        if (!categoryData) return;
        if (categoryData.info) setCategoryInfo(categoryData.info);
        if (categoryData.sub) setSubCategories(categoryData.sub);

        const adsQuery = query(collection(db, "ads"), where("category", "==", categoryName.toLowerCase()));
        const adsSnapshot = await getDocs(adsQuery);
        const adsData = adsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllAds(adsData);
        setAds(adsData);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryName]);

  useEffect(() => {
    setAds(selectedSubCategory ? allAds.filter((ad) => ad.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase()) : allAds);
  }, [selectedSubCategory, allAds]);

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
    <div>
      {categoryInfo && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h2 className="text-2xl font-bold mb-2">{categoryName}</h2>
          {categoryInfo.description && <p className="whitespace-pre-line">{categoryInfo.description}</p>}
          {categoryInfo.phone && <p>Aloqa: {categoryInfo.phone}</p>}
          <button onClick={handleGoToChat} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Izoh qoldirish
          </button>
        </div>
      )}
      {showSubCategories && (
        <div className="flex gap-2 mb-4 flex-wrap">
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
    </div>
  );
}
