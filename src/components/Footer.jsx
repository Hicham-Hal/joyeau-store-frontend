import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import Logo from "./Logo";
import { useLang } from "../context/LanguageContext";
import { SOCIAL_LINKS } from "../data/contactInfo";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gradient-to-b from-[#2b1620] to-[#1c0f16] text-rose-50/90 mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 text-sm text-rose-100/60 max-w-xs">{t.footer.tagline}</p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              className="h-11 w-11 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-gold-400 hover:to-blush-500 flex items-center justify-center transition"
            >
              <FaInstagram />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noreferrer"
              className="h-11 w-11 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-gold-400 hover:to-blush-500 flex items-center justify-center transition"
            >
              <FaTiktok />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="h-11 w-11 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-gold-400 hover:to-blush-500 flex items-center justify-center transition"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-gold-200">{t.footer.quickLinks}</h4>
          <ul className="space-y-2.5 text-sm text-rose-100/70">
            <li><Link to="/" className="hover:text-gold-200 transition">{t.nav.home}</Link></li>
            <li><Link to="/collections" className="hover:text-gold-200 transition">{t.nav.collections}</Link></li>
            <li><Link to="/a-propos" className="hover:text-gold-200 transition">{t.nav.about}</Link></li>
            <li><Link to="/contact" className="hover:text-gold-200 transition">{t.nav.contact}</Link></li>
            <li><Link to="/espace-vendeur" className="hover:text-gold-200 transition">{t.nav.dashboard}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-gold-200">{t.footer.contactUs}</h4>
          <ul className="space-y-2.5 text-sm text-rose-100/70">
            <li className="flex items-center gap-2">
              <FaPhoneAlt size={12} /> {SOCIAL_LINKS.workshopPhone}
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt size={12} /> {SOCIAL_LINKS.ordersPhone}
            </li>
            <li>{t.contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 pb-24 md:pb-5 text-center text-xs text-rose-100/50">
        © {new Date().getFullYear()} Joyau Brillant Boutique, Batna — {t.footer.rights}
      </div>
    </footer>
  );
}
