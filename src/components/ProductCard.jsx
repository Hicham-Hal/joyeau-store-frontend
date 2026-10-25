import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { useCategoryLabel } from "../store/hooks";
import PriceTag from "./PriceTag";

// Compact card: small picture (4:5) so two cards fit side by side on a phone.
export default function ProductCard({ product, index = 0 }) {
  const { lang, t } = useLang();
  const getCategoryLabel = useCategoryLabel();
  const cover = product.images?.[0] || product.colors?.find((c) => c.url && c.type === "image")?.url || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group"
    >
      <Link
        to={`/produit/${product.id}`}
        className="block rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-blush-100 active:scale-[0.99] md:hover:shadow-xl md:hover:shadow-blush-200/50 transition-all duration-300"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-blush-50">
          {cover && (
            <img
              src={cover}
              alt={product.name[lang]}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 md:group-hover:scale-110"
            />
          )}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              decoding="async"
              className="hidden md:block absolute inset-0 h-full w-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
          <div className="absolute top-2 start-2 flex flex-col items-start gap-1">
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] md:text-[10px] font-semibold uppercase shadow">
                {t.common.new}
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-0.5 rounded-full bg-gold-500/95 text-white text-[9px] md:text-[10px] font-semibold uppercase shadow">
                {t.common.bestseller}
              </span>
            )}
          </div>
          {!product.stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-semibold uppercase border border-white/70 px-3 py-1 rounded-full">
                {t.common.outOfStock}
              </span>
            </div>
          )}
        </div>
        <div className="p-2.5 md:p-4">
          <p className="text-[10px] md:text-[11px] uppercase tracking-wider text-gold-600 font-semibold mb-0.5 line-clamp-1">
            {getCategoryLabel(product.category, lang)}
          </p>
          <h3 className="font-serif font-bold text-[0.98rem] md:text-lg leading-snug text-blush-900 mb-1.5 line-clamp-1">
            {product.name[lang]}
          </h3>
          <div className="flex items-center justify-between gap-1">
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />
            <span className="text-[10px] md:text-[11px] text-stone-400 whitespace-nowrap">
              {product.prepDays} {t.collections.days}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
