import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { HiOutlinePhone, HiOutlineMapPin, HiOutlinePaperAirplane, HiOutlineCheckCircle } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { SOCIAL_LINKS } from "../data/contactInfo";
import { useAppDispatch } from "../store/hooks";
import { sendMessage } from "../store/slices/messagesSlice";
import Reveal from "../components/Reveal";

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const dispatch = useAppDispatch();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return;
    setSending(true);
    setSendError("");
    try {
      await dispatch(sendMessage(form)).unwrap();
      setSent(true);
      setForm({ name: "", phone: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      // keep what the visitor typed so nothing is lost
      setSendError(t.common.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-20">
      <Reveal className="text-center mb-8 md:mb-14">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-blush-500">{t.nav.contact}</span>
        <h1 className="font-serif font-bold text-[2rem] md:text-5xl text-blush-900 mt-1 leading-tight">{t.contact.title}</h1>
        <p className="text-stone-500 mt-3 max-w-xl mx-auto">{t.contact.subtitle}</p>
      </Reveal>

      <div className="grid md:grid-cols-5 gap-6 md:gap-10">
        <Reveal className="md:col-span-2 space-y-5">
          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-blush-700 to-blush-900 text-white shadow-lg">
            <h3 className="font-serif text-xl mb-5">{t.contact.follow}</h3>
            <div className="space-y-4">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold-200 transition">
                <span className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
                  <FaInstagram size={18} />
                </span>
                Instagram
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold-200 transition">
                <span className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
                  <FaTiktok size={18} />
                </span>
                TikTok
              </a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold-200 transition">
                <span className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
                  <FaWhatsapp size={18} />
                </span>
                WhatsApp
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blush-50 border border-blush-100">
            <div className="flex items-start gap-3 mb-4">
              <HiOutlinePhone className="text-blush-600 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-stone-700">{t.contact.callWorkshop}</p>
                <a href={`tel:${SOCIAL_LINKS.workshopPhone.replace(/\s/g, "")}`} className="text-blush-700 font-semibold">
                  {SOCIAL_LINKS.workshopPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <HiOutlinePhone className="text-blush-600 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-stone-700">{t.contact.callOrders}</p>
                <a href={`tel:${SOCIAL_LINKS.ordersPhone.replace(/\s/g, "")}`} className="text-blush-700 font-semibold">
                  {SOCIAL_LINKS.ordersPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineMapPin className="text-blush-600 mt-1" size={20} />
              <p className="text-sm text-stone-600">{t.contact.address}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="md:col-span-3 p-4 md:p-8 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
          <h3 className="font-serif text-xl text-blush-900 mb-6">{t.contact.formTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t.contact.name}</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t.contact.phone}</label>
              <div className="relative">
                <HiOutlinePhone className="absolute top-1/2 -translate-y-1/2 left-4 text-stone-400 pointer-events-none" size={20} />
                <input
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/[^0-9+\s]/g, "") }))}
                  placeholder="05 XX XX XX XX"
                  required
                  className="input-field !ps-14"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t.contact.message}</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                rows={5}
                placeholder={t.contact.messagePlaceholder}
                className="input-field resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-shine w-full sm:w-auto flex items-center justify-center gap-2 min-h-[52px] px-8 rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg active:scale-[0.99] transition disabled:opacity-60"
            >
              <HiOutlinePaperAirplane size={18} /> {sending ? t.common.loading : t.contact.send}
            </button>
            {sendError && (
              <p className="text-sm text-rose-600" role="alert">
                {sendError}
              </p>
            )}
            {sent && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-600 text-sm font-medium"
              >
                <HiOutlineCheckCircle /> {t.contact.sent}
              </motion.p>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  );
}
