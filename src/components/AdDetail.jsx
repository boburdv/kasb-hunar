import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function AdDetail() {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      const docSnap = await getDoc(doc(db, "ads", adId));
      if (docSnap.exists()) setAd({ id: docSnap.id, ...docSnap.data() });
    };
    fetchAd();
  }, [adId]);

  if (!ad) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      {ad.imageURL && <img src={ad.imageURL} alt={ad.title} className="w-full h-64 object-cover rounded mb-4" />}
      <h2 className="text-2xl font-bold">{ad.title}</h2>
      <p className="text-gray-700 mt-2">{ad.description}</p>
      {ad.price && <p className="text-green-600 font-semibold mt-2">{ad.price} so‘m</p>}
      <p className="mt-2">
        <strong>Kategoriya:</strong> {ad.category}
      </p>
      <p>
        <strong>Subkategoriya:</strong> {ad.subCategory}
      </p>
      {ad.createdAt?.toDate && (
        <p className="text-gray-500 text-sm mt-1">
          <strong>Yaratilgan sana:</strong> {ad.createdAt.toDate().toLocaleString()}
        </p>
      )}
    </div>
  );
}
