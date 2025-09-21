import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const q = query(collection(db, "ads"), where("category", "==", categoryName.toLowerCase()));
      const snapshot = await getDocs(q);
      setAds(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAds();
  }, [categoryName]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kategoriya: {categoryName}</h2>
      {ads.length === 0 ? (
        <p>Hozircha e'lonlar yo'q.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ads.map((ad) => (
            <li key={ad.id} className="border p-3 rounded flex gap-3 items-start">
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
