import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { BsTelegram } from "react-icons/bs";
import { PhoneIcon } from "@heroicons/react/16/solid";

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

  useEffect(() => auth.onAuthStateChanged(setCurrentUser), []);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [categoryName]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const category = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).find((cat) => cat.name?.toLowerCase() === categoryName?.toLowerCase());
        if (!category) return;
        setCategoryData(category);
        if (category.sub) setSubCategories(category.sub.filter((sub) => sub && sub !== "0"));

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

    window.scrollTo({ top: 0 });
  }, [categoryName]);

  useEffect(() => {
    if (!selectedSubCategory) setAds(allAds);
    else setAds(allAds.filter((ad) => ad.subCategory && ad.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()));
  }, [selectedSubCategory, allAds]);

  const handleGoToChat = () => {
    if (!currentUser) {
      navigate(`/auth?redirect=/chat/category-${categoryName.toLowerCase()}`);
      return;
    }
    navigate(`/chat/category-${categoryName.toLowerCase()}`);
  };

  function DescriptionWithReadMore({ text }) {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;
    const shouldClamp = text.split("\n").length > 7;
    return (
      <div className="text-gray-700 whitespace-pre-line">
        <p className={expanded ? "" : "line-clamp-[8]"}>{text}</p>
        {shouldClamp && (
          <button onClick={() => setExpanded(!expanded)} className="text-blue-600 font-semibold mt-2">
            {expanded ? "Yopish" : "Ko'proq o'qish"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-36 mb-24">
      {loading ? (
        <div className="rounded-lg bg-base-100  mb-6 md:flex md:flex-row overflow-hidden animate-pulse">
          <div className="md:w-1/2 w-full relative" style={{ paddingTop: "66.66%" }}>
            <div className="absolute top-0 left-0 w-full h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="card-body md:w-1/2 w-full flex flex-col gap-3 pt-8 px-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div className="flex gap-2 mt-16">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded self-end"></div>
          </div>
        </div>
      ) : (
        categoryData && (
          <div className="rounded-lg bg-base-100 shadow-sm mb-6 md:flex md:flex-row overflow-hidden">
            <figure className="md:w-1/2 w-full">
              <div className="relative w-full" style={{ paddingTop: "66.66%" }}>
                <img src="./public/asalarichi.jpg" alt={categoryData.name} className="absolute top-0 left-0 w-full h-full object-cover" />
              </div>
            </figure>
            <div className="card-body md:w-1/2 w-full">
              <h2 className="card-title text-3xl font-bold">{categoryData.name}</h2>
              <DescriptionWithReadMore text={categoryData.description} />
              {categoryData.phone && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1 mt-4">
                  <a href={`tel:${categoryData.phone}`} className="flex items-center gap-1 font-semibold text-gray-700 link link-hover">
                    <PhoneIcon className="w-4 h-4" />
                    {categoryData.phone}
                  </a>
                  {categoryData.telegram && (
                    <a href={categoryData.telegram} target="_blank" rel="noopener noreferrer" className="link link-hover font-semibold text-blue-700 flex items-center gap-1 px-0">
                      <BsTelegram className="w-4 h-4" /> Telegram
                    </a>
                  )}
                </div>
              )}
              <div className="card-actions justify-end">
                <button onClick={handleGoToChat} className="btn btn-primary">
                  Izoh qoldirish
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedSubCategory("")} className={`btn btn-soft ${selectedSubCategory === "" ? "btn-primary" : ""}`}>
          Barchasi
        </button>
        {subCategories.map((sub, i) => (
          <button key={i} onClick={() => setSelectedSubCategory(sub)} className={`btn btn-soft ${selectedSubCategory === sub ? "btn-primary" : ""}`}>
            {sub}
          </button>
        ))}
      </div>

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
