import { useLang } from "../context/LanguageContext";

export function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function PriceTag({ price, oldPrice, size = "md", className = "" }) {
  const { t } = useLang();
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl md:text-3xl",
  };
  return (
    <span className={`inline-flex items-baseline gap-2 font-semibold text-blush-700 ${sizes[size]} ${className}`}>
      <span>
        {formatPrice(price)} <span className="text-xs font-medium text-gold-600">{t.common.dzd}</span>
      </span>
      {oldPrice && (
        <span className="text-xs md:text-sm font-normal text-stone-400 line-through">
          {formatPrice(oldPrice)}
        </span>
      )}
    </span>
  );
}
