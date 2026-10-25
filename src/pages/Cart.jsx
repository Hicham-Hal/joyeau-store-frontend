import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { useCart, useStoreStatus } from "../store/hooks";
import PriceTag, { formatPrice } from "../components/PriceTag";
import Reveal from "../components/Reveal";

export default function Cart() {
  const { t, lang } = useLang();
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { isOpen: storeOpen } = useStoreStatus();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-20">
      <Reveal className="text-center mb-6 md:mb-10">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-blush-500">{t.nav.cart}</span>
        <h1 className="font-serif font-bold text-[2rem] md:text-5xl text-blush-900 mt-1 leading-tight">{t.cart.title}</h1>
      </Reveal>

      {items.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-5">
          <HiOutlineShoppingBag className="text-blush-200" size={72} />
          <p className="text-stone-500">{t.cart.empty}</p>
          <Link
            to="/collections"
            className="inline-flex items-center h-12 px-7 rounded-full bg-blush-700 text-white font-medium active:bg-blush-800 transition"
          >
            {t.cart.startShopping}
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it) => (
              <Reveal key={it.key} className="flex gap-3 p-3 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
                <img src={it.image} alt="" className="h-24 w-[4.5rem] object-cover object-top rounded-xl shrink-0 bg-blush-50" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-[1.05rem] leading-snug text-blush-900">{it.name[lang]}</h3>
                    <button
                      onClick={() => removeFromCart(it.key)}
                      className="h-9 w-9 -mt-1 -me-1 flex items-center justify-center text-stone-300 active:text-rose-500 md:hover:text-rose-500"
                      aria-label={t.cart.remove}
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {t.cart.size}: <strong>{it.size || "—"}</strong> • {t.cart.color}: <strong>{it.color || "—"}</strong>
                  </p>
                  {it.bodyNote && (
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 italic">
                      {t.cart.bodyNote}: {it.bodyNote}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-blush-200 rounded-full overflow-hidden">
                      <button className="w-10 h-10 active:bg-blush-50" onClick={() => updateQuantity(it.key, it.quantity - 1)}>
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <button className="w-10 h-10 active:bg-blush-50" onClick={() => updateQuantity(it.key, it.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <PriceTag price={it.price * it.quantity} />
                  </div>
                </div>
              </Reveal>
            ))}
            <Link to="/collections" className="inline-block text-blush-600 underline underline-offset-4 text-sm py-2">
              {t.cart.continueShopping}
            </Link>
          </div>

          <Reveal delay={0.05} className="h-fit p-5 md:p-6 rounded-2xl bg-blush-50 border border-blush-100 lg:sticky lg:top-24">
            <h3 className="font-serif font-bold text-xl text-blush-900 mb-4">{t.cart.subtotal}</h3>
            <div className="flex justify-between text-sm text-stone-500 mb-3">
              <span>
                {t.cart.product} ({items.length})
              </span>
              <span>
                {formatPrice(subtotal)} {t.common.dzd}
              </span>
            </div>
            <div className="h-px bg-blush-200 my-3" />
            <div className="flex justify-between font-semibold text-blush-800 text-lg mb-5">
              <span>{t.cart.subtotal}</span>
              <span>
                {formatPrice(subtotal)} {t.common.dzd}
              </span>
            </div>
            {storeOpen ? (
              <Link
                to="/commande"
                className="btn-shine flex items-center justify-center w-full min-h-[52px] rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg active:scale-[0.99] transition"
              >
                {t.cart.checkout}
              </Link>
            ) : (
              <p className="text-center text-sm text-rose-600 font-medium py-3">{t.storeClosed.text}</p>
            )}
          </Reveal>
        </div>
      )}
    </div>
  );
}
