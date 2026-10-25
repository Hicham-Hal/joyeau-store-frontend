import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "./Logo";
import { useLang } from "../context/LanguageContext";
import { useCart } from "../store/hooks";
import { SOCIAL_LINKS } from "../data/contactInfo";

export default function Navbar() {
  const { t, lang, setLang, isAr } = useLang();
  const { count, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the menu when the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // lock the page scroll while the menu is open + close with the Escape key
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const links = [
    { to: "/", label: t.nav.home, icon: HiOutlineHome },
    { to: "/collections", label: t.nav.collections, icon: HiOutlineSparkles },
    { to: "/a-propos", label: t.nav.about, icon: HiOutlineInformationCircle },
    { to: "/contact", label: t.nav.contact, icon: HiOutlinePhone },
  ];

  const Chevron = isAr ? HiOutlineChevronLeft : HiOutlineChevronRight;

  const desktopLinkClass = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors duration-300 py-1 ${
      isActive ? "text-blush-700" : "text-stone-600 hover:text-blush-600"
    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gradient-to-r after:from-gold-400 after:to-blush-500 after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  // The drawer is rendered with a portal on <body>. It must NOT live inside the
  // <header>: the header uses backdrop-blur, and that traps "fixed" children inside
  // the header box (this is what made the old menu look broken on phones).
  const drawer = (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/55 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            initial={{ x: isAr ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 end-0 w-[88%] max-w-sm bg-white z-[61] shadow-2xl lg:hidden flex flex-col h-[100dvh]"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-blush-100 shrink-0">
              <Logo onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => setMenuOpen(false)}
                className="h-11 w-11 flex items-center justify-center rounded-full bg-blush-50 text-blush-800 active:bg-blush-100"
                aria-label={t.common.close}
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: isAr ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-2xl text-[1.05rem] font-medium transition active:scale-[0.99] ${
                        isActive
                          ? "bg-gradient-to-r from-blush-600 to-blush-700 text-white shadow-md shadow-blush-300/50"
                          : "bg-blush-50/70 text-stone-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive ? "bg-white/20 text-white" : "bg-white text-blush-600 shadow-sm"
                          }`}
                        >
                          <l.icon size={21} />
                        </span>
                        <span className="flex-1">{l.label}</span>
                        <Chevron size={18} className={isActive ? "text-white/80" : "text-stone-300"} />
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, x: isAr ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + links.length * 0.05 }}
                onClick={() => {
                  setMenuOpen(false);
                  setCartOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-[1.05rem] font-medium bg-gold-50 text-stone-800 text-start active:scale-[0.99]"
              >
                <span className="h-10 w-10 rounded-xl bg-white text-gold-600 shadow-sm flex items-center justify-center shrink-0">
                  <HiOutlineShoppingBag size={21} />
                </span>
                <span className="flex-1">{t.nav.cart}</span>
                {count > 0 && (
                  <span className="min-w-6 h-6 px-1.5 rounded-full bg-gradient-to-br from-blush-600 to-gold-500 text-white text-xs font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </motion.button>
            </nav>

            <div className="shrink-0 border-t border-blush-100 p-4 pb-safe space-y-3">
              {/* language switch */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-blush-50 border border-blush-100" dir="ltr">
                {[
                  { id: "fr", label: "Français" },
                  { id: "ar", label: "العربية" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`h-11 rounded-full text-sm font-semibold transition ${
                      lang === l.id ? "bg-blush-700 text-white shadow" : "text-blush-700"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 h-12 rounded-full bg-[#25D366] text-white font-semibold"
              >
                <FaWhatsapp size={22} /> WhatsApp
              </a>

              <NavLink
                to="/espace-vendeur"
                className="flex items-center justify-center gap-2 text-xs text-stone-400 py-1"
              >
                <HiOutlineLockClosed size={14} /> {t.nav.dashboard}
              </NavLink>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md shadow-blush-100" : "bg-white/85 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-2">
        <Logo />

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={desktopLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="h-10 min-w-10 px-3 flex items-center justify-center rounded-full border border-blush-200 text-xs font-bold text-blush-700 hover:bg-blush-50 transition"
            title="FR / AR"
          >
            {lang === "fr" ? "AR" : "FR"}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative h-11 w-11 flex items-center justify-center rounded-full hover:bg-blush-50 active:bg-blush-100 text-blush-700 transition"
            aria-label={t.nav.cart}
          >
            <HiOutlineShoppingBag size={24} />
            {count > 0 && (
              <span className="absolute top-0.5 -end-0.5 min-w-5 h-5 px-1 rounded-full bg-gradient-to-br from-blush-600 to-gold-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden h-11 w-11 flex items-center justify-center rounded-full bg-blush-50 text-blush-800 active:bg-blush-100"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <HiOutlineBars3 size={26} />
          </button>
        </div>
      </div>

      {typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </header>
  );
}
