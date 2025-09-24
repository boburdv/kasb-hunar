import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      setCategories(snapshot.docs.map((doc) => doc.data().name));
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold my-4">Kategoriyalar</h2>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/${cat}`}
            className="
              bg-white shadow-sm rounded-xl p-6 
              flex items-center justify-center 
              text-lg font-semibold 
              hover:shadow-lg hover:scale-105 
              transition-all
            "
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
