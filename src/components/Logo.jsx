import { Link } from "react-router-dom";

// Logo picture + the brand name written with a script font that matches the logo.
// `light` = for dark backgrounds (footer). `compact` = picture only.
export default function Logo({ compact = false, light = false, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 shrink-0 group min-w-0" aria-label="Joyau Brillant Boutique">
      <img
        src="/images/logo-256.jpg"
        alt=""
        width="48"
        height="48"
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-rose-200 shadow-sm shadow-rose-200/50 transition-transform duration-300 group-hover:scale-105"
      />
      {!compact && (
        <span className="flex flex-col leading-none min-w-0" dir="ltr">
          <span
            className={`font-brand text-[1.7rem] sm:text-[2rem] leading-[1.05] whitespace-nowrap pe-1 ${
              light ? "text-shine-gold" : "text-rosegold"
            }`}
          >
            Joyau Brillant
          </span>
          <span
            className={`brand-sub text-[9px] sm:text-[10px] ps-[0.1rem] ${
              light ? "text-gold-200/80" : "text-[#8a4b30]/80"
            }`}
          >
            Boutique
          </span>
        </span>
      )}
    </Link>
  );
}
