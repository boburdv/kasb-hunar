import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [ads, setAds] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const categoryData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());

      if (categoryData?.sub) setSubCategories(categoryData.sub);
      if (categoryData?.info) setCategoryInfo(categoryData.info); // yangi state kerak
    };
    fetchCategoryData();
  }, [categoryName]);

  useEffect(() => {
    const fetchAds = async () => {
      let q;
      if (selectedSubCategory) {
        q = query(collection(db, "ads"), where("category", "==", categoryName.toLowerCase()), where("subCategory", "==", selectedSubCategory.toLowerCase()));
      } else {
        q = query(collection(db, "ads"), where("category", "==", categoryName.toLowerCase()));
      }
      const snapshot = await getDocs(q);
      setAds(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAds();
  }, [categoryName, selectedSubCategory]);

  return (
    <div>
      {categoryInfo && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
          <p>Ta'srif: {categoryInfo.description}</p>
          <br />
          <p>Telefon: {categoryInfo.phone}</p>
        </div>
      )}

      {subCategories.length > 0 && (
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
                {ad.price && <p className="text-green-600 font-semibold">{ad.price} so‘m</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
