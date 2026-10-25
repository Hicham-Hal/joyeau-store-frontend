import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslation } from "../data/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("jb_lang") || "fr");

  useEffect(() => {
    localStorage.setItem("jb_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = useMemo(() => getTranslation(lang), [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const value = {
    lang,
    dir,
    t,
    isAr: lang === "ar",
    toggleLang: () => setLang((prev) => (prev === "fr" ? "ar" : "fr")),
    setLang,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
