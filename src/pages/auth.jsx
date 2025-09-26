import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // yangi state
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 1. Foydalanuvchini yaratish
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // 2. DisplayName qo‘shish
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      }
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {!isLogin && <input type="text" placeholder="Full Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="border p-2 rounded" required />}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm cursor-pointer text-blue-600" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create new account" : "Already have an account?"}
      </p>
    </div>
  );
}
