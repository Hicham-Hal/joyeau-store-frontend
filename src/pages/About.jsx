import { useLang } from "../context/LanguageContext";
import { ATELIER_GALLERY } from "../data/products";
import SectionHeading from "../components/SectionHeading";
import ImageMarquee from "../components/ImageMarquee";
import Reveal from "../components/Reveal";
import { Link } from "react-router-dom";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

export default function About() {
  const { t } = useLang();

  return (
    <div>
      {/* Hero banner */}
      <section className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3984853/pexels-photo-3984853.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70" />
        <Reveal className="relative z-10 text-center px-6">
          <h1 className="font-serif text-[2.2rem] leading-tight md:text-6xl text-white font-bold">{t.about.title}</h1>
          <p className="mt-3 max-w-2xl mx-auto text-rose-50/90 text-[0.95rem] md:text-base">{t.about.lead}</p>
        </Reveal>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-blush-500">
            {t.brand}
          </span>
          <h2 className="font-serif font-bold text-[1.9rem] md:text-4xl text-blush-900 mt-2 mb-3 leading-tight">{t.about.storyTitle}</h2>
          <p className="text-stone-500 leading-relaxed mb-8">{t.about.storyText}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
            {t.about.values.map((v) => (
              <div key={v.title} className="p-4 rounded-xl bg-blush-50 border border-blush-100">
                <HiOutlineCheckBadge className="text-blush-600 mb-2" size={22} />
                <h4 className="font-serif text-blush-900 mb-1">{v.title}</h4>
                <p className="text-xs text-stone-500">{v.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
          <img src={ATELIER_GALLERY[0]} alt="" loading="lazy" className="rounded-2xl h-40 md:h-64 object-cover w-full shadow-lg" />
          <img src={ATELIER_GALLERY[1]} alt="" loading="lazy" className="rounded-2xl h-40 md:h-64 object-cover w-full shadow-lg mt-6 md:mt-8" />
          <img src={ATELIER_GALLERY[2]} alt="" loading="lazy" className="rounded-2xl h-32 md:h-48 object-cover w-full shadow-lg" />
          <img src={ATELIER_GALLERY[3]} alt="" loading="lazy" className="rounded-2xl h-32 md:h-48 object-cover w-full shadow-lg mt-[-1.5rem] md:mt-[-2rem]" />
        </Reveal>
      </section>

      {/* Gallery strip */}
      <section className="py-9 md:py-14 bg-blush-50/60">
        <Reveal className="text-center mb-6">
          <h3 className="font-script text-[2rem] md:text-5xl text-rosegold leading-tight">{t.about.galleryTitle}</h3>
        </Reveal>
        <ImageMarquee images={ATELIER_GALLERY} />
      </section>

      {/* How to order steps */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-24">
        <SectionHeading eyebrow={t.nav.about} title={t.about.howTitle} />
        <div className="relative">
          <div className="hidden md:block absolute top-10 start-0 end-0 h-0.5 bg-gradient-to-r from-transparent via-blush-200 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
            {t.about.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} className="relative text-center">
                <div className="relative z-10 mx-auto mb-4 h-16 w-16 rounded-full bg-white ring-4 ring-blush-100 shadow-md flex items-center justify-center font-serif text-xl text-blush-700">
                  {i + 1}
                </div>
                <h4 className="font-serif text-blush-900 mb-2">{step.title.replace(/^\d+\.\s*/, "")}</h4>
                <p className="text-sm text-stone-500">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deposit explanation */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blush-700 via-blush-600 to-gold-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
        <Reveal className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <HiOutlineCurrencyDollar className="mx-auto mb-4" size={42} />
          <h3 className="font-serif text-2xl md:text-3xl mb-4">{t.about.depositTitle}</h3>
          <p className="text-rose-50/90 leading-relaxed mb-8">{t.about.depositText}</p>
          <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 font-semibold">
            1000 — 2000 {t.common.dzd}
          </div>
          <div className="mt-8">
            <Link
              to="/collections"
              className="btn-shine inline-flex items-center min-h-[52px] px-8 rounded-full bg-white text-blush-700 font-semibold shadow-lg active:scale-[0.98] md:hover:scale-105 transition-transform"
            >
              {t.home.ctaShop}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
