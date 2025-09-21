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
    <div>
      <h2 className="text-2xl font-bold mb-4">Kategoriyalar</h2>
      <ul className="flex flex-col gap-2">
        {categories.map((cat) => (
          <li key={cat}>
            <Link to={`/${cat.toLowerCase()}`} className="text-blue-600 underline">
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
