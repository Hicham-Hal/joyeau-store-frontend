import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineX, HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from "../store/hooks";
import { useLang } from "../context/LanguageContext";
import PriceTag, { formatPrice } from "./PriceTag";

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { lang, t } = useLang();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: lang === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 bottom-0 end-0 w-full sm:w-[420px] bg-white z-[61] shadow-2xl flex flex-col h-[100dvh]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-blush-100">
              <h3 className="font-serif text-xl text-blush-900 flex items-center gap-2">
                <HiOutlineShoppingBag className="text-blush-500" /> {t.cart.title}
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="h-11 w-11 flex items-center justify-center rounded-full active:bg-blush-50 text-stone-500"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <HiOutlineShoppingBag className="text-blush-200" size={56} />
                  <p className="text-stone-500">{t.cart.empty}</p>
                  <Link
                    to="/collections"
                    onClick={() => setCartOpen(false)}
                    className="text-blush-600 font-medium underline underline-offset-4"
                  >
                    {t.cart.startShopping}
                  </Link>
                </div>
              )}
              {items.map((it) => (
                <div key={it.key} className="flex gap-3 border-b border-blush-50 pb-4">
                  <img src={it.image} alt="" className="h-20 w-16 object-cover object-top rounded-lg shrink-0 bg-blush-50" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-blush-900 line-clamp-1">{it.name[lang]}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {t.cart.size}: {it.size || "—"} • {t.cart.color}: {it.color || "—"}
                    </p>
                    {it.bodyNote && <p className="text-[11px] text-stone-400 line-clamp-1 italic">{it.bodyNote}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-blush-200 rounded-full overflow-hidden text-sm">
                        <button
                          className="w-9 h-9 active:bg-blush-50"
                          onClick={() => updateQuantity(it.key, it.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-7 text-center">{it.quantity}</span>
                        <button
                          className="w-9 h-9 active:bg-blush-50"
                          onClick={() => updateQuantity(it.key, it.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <PriceTag price={it.price * it.quantity} size="sm" />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(it.key)}
                    className="text-stone-300 hover:text-rose-500 shrink-0"
                    aria-label={t.cart.remove}
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-blush-100 p-4 pb-safe space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{t.cart.subtotal}</span>
                  <span className="font-semibold text-blush-800">{formatPrice(subtotal)} {t.common.dzd}</span>
                </div>
                <Link
                  to="/panier"
                  onClick={() => setCartOpen(false)}
                  className="flex items-center justify-center w-full h-12 rounded-full bg-blush-50 text-blush-700 font-medium active:bg-blush-100 transition"
                >
                  {t.cart.title}
                </Link>
                <Link
                  to="/commande"
                  onClick={() => setCartOpen(false)}
                  className="btn-shine flex items-center justify-center w-full h-12 rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg shadow-blush-300/50 transition"
                >
                  {t.cart.checkout}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
