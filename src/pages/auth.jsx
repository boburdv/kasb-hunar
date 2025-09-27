import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      }
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-96 bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">{isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}</h2>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && <input type="text" placeholder="To‘liq Ism" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input input-bordered w-full" required />}
            <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" required />
            <input type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="loading loading-spinner"></span>}
              {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <button onClick={handleGoogleSignIn} className="btn w-full flex items-center justify-center gap-2 bg-white text-black border border-[#e5e5e5] mt-2" disabled={googleLoading}>
            {googleLoading && <span className="loading loading-spinner"></span>}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" className="inline-block">
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
              </g>
            </svg>
            {isLogin ? "Google bilan Kirish" : "Google bilan Ro‘yxatdan o‘tish"}
          </button>

          <p className="mt-4 text-center text-sm cursor-pointer text-blue-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Yangi hisob yaratish" : "Allaqachon hisobingiz bormi?"}
          </p>
        </div>
      </div>
    </div>
  );
}
