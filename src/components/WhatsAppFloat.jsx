import { FaWhatsapp } from "react-icons/fa";
import { SOCIAL_LINKS } from "../data/contactInfo";

export default function WhatsAppFloat() {
  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 end-5 z-30 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 hover:scale-110 transition-transform duration-300 animate-bounce"
      style={{ animationDuration: "3s" }}
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={26} />
    </a>
  );
}
