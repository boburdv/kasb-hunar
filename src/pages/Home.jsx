import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const categoriesRef = useRef(null);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const categoryData = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        description: doc.data().description,
      }));
      setCategories(categoryData);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] mt-[118px]">
        <img src="/home-img.jpg" alt="hero-image" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-6xl w-full text-white text-center md:text-left space-y-4 md:space-y-6">
            <span className="inline-block bg-primary px-4 py-1.5 rounded-full text-sm font-semibold">RISHTON TUMAN</span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug md:max-w-lg">1-son politeхnikumiga xush kelibsiz</h1>

            <p className="max-w-md md:max-w-lg text-base md:text-lg font-medium text-white/90">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, voluptatum sunt incidunt reprehenderit laboriosam fugiat in doloribus totam veniam!
            </p>

            <button onClick={scrollToCategories} className="btn btn-primary mt-4 md:mt-6">
              Kasb yo'nalishlari
            </button>
          </div>
        </div>
      </div>

      <div ref={categoriesRef} className="max-w-6xl mx-auto mt-24 mb-24">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">Kasb yo'nalishlari</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {categories.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-4 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 w-full bg-gray-300"></div>
                  <div className="h-4 w-28 bg-gray-300 mx-4 mt-2 rounded"></div>
                  <div className="h-4 w-full bg-gray-300 mx-4 rounded"></div>
                  <div className="h-4 w-full bg-gray-300 mx-4 rounded"></div>
                </div>
              ))
            : categories.map((cat) => (
                <Link key={cat.name} to={`/${cat.name}`}>
                  <div className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <figure className="aspect-[3/2] overflow-hidden">
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </figure>
                    <div className="card-body p-4 md:p-5">
                      <h2 className="card-title text-lg md:text-xl font-semibold">{cat.name}</h2>
                      <p className="line-clamp-3 text-sm md:text-base text-gray-700">{cat.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
