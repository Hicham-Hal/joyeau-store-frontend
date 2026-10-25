import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-script text-7xl text-blush-400 mb-4">404</h1>
      <p className="text-stone-500 mb-8">{t.common.notFound}</p>
      <Link to="/" className="inline-flex items-center min-h-[52px] px-8 rounded-full bg-blush-700 text-white font-medium active:bg-blush-800 transition">
        {t.orderSuccess.backHome}
      </Link>
    </div>
  );
}
