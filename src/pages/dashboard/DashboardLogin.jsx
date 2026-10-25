import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";
import { USE_MOCK } from "../../api/axiosClient";
import { useAuth } from "../../store/hooks";
import { useLang } from "../../context/LanguageContext";
import Logo from "../../components/Logo";

export default function DashboardLogin() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/espace-vendeur/tableau-de-bord");
    } catch (err) {
      // wrong credentials vs. backend unreachable / server error
      const invalid = err?.status === 400 || err?.status === 401 || err?.message === "invalid_credentials";
      setError(invalid ? t.dashboard.invalidLogin : t.common.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2b1620] via-[#3b1e2a] to-[#1c0f16] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10"
      >
        <div className="flex justify-center mb-6">
          <Logo compact />
        </div>
        <h1 className="font-serif text-2xl text-blush-900 text-center mb-1">{t.dashboard.loginTitle}</h1>
        <p className="text-sm text-stone-500 text-center mb-8">{t.dashboard.loginText}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">{t.dashboard.username}</label>
            <div className="relative">
              <HiOutlineUser className="absolute top-1/2 -translate-y-1/2 start-3 text-stone-400" size={18} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-blush-200 ps-9 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">{t.dashboard.password}</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute top-1/2 -translate-y-1/2 start-3 text-stone-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-blush-200 ps-9 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full py-3.5 rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
          >
            {loading ? t.common.loading : t.dashboard.login}
          </button>
          {USE_MOCK && <p className="text-[11px] text-stone-400 text-center">Démo : admin / admin123</p>}
        </form>
      </motion.div>
    </div>
  );
}
