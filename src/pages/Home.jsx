import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineSparkles, HiOutlineTruck, HiOutlineCreditCard, HiOutlineScissors } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { useAppDispatch, useAppSelector, useCategories } from "../store/hooks";
import { fetchProducts } from "../store/slices/productsSlice";
import { ATELIER_GALLERY, FABRIC_STRIP } from "../data/products";
import { HERO_IMAGES, HERO_POSITIONS, UNIVERS_DRESSES } from "../data/siteImages";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import ImageMarquee from "../components/ImageMarquee";
import AnimatedText from "../components/AnimatedText";
import Reveal from "../components/Reveal";

// fabric, dress, fabric, dress... (the dresses are the photos in src/data/siteImages.js)
function mixStrip(fabrics, dresses) {
  const mixed = [];
  const length = Math.max(fabrics.length, dresses.length);
  for (let i = 0; i < length; i += 1) {
    if (fabrics[i]) mixed.push(fabrics[i]);
    if (dresses[i]) mixed.push(dresses[i]);
  }
  return mixed;
}

export default function Home() {
  const { t, lang } = useLang();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const { categories, loaded: categoriesLoaded, failed: categoriesFailed } = useCategories();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (HERO_IMAGES.length < 2) return undefined;
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const strip = useMemo(() => mixStrip(FABRIC_STRIP, UNIVERS_DRESSES), []);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  const whyItems = [
    { icon: HiOutlineScissors, title: t.home.why1Title, text: t.home.why1Text },
    { icon: HiOutlineSparkles, title: t.home.why2Title, text: t.home.why2Text },
    { icon: HiOutlineTruck, title: t.home.why3Title, text: t.home.why3Text },
    { icon: HiOutlineCreditCard, title: t.home.why4Title, text: t.home.why4Text },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* HERO ------------------------------------------------------------------ */}
      <section className="relative w-full overflow-hidden flex items-end md:items-center justify-center h-[calc(100svh-4rem)] min-h-[540px] max-h-[860px] md:h-[88vh] md:max-h-none">
        {HERO_IMAGES.map((src, i) => (
          <motion.div
            key={src}
            initial={false}
            animate={{ opacity: i === heroIndex ? 1 : 0, scale: i === heroIndex ? 1 : 1.07 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={src}
              alt=""
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{ objectPosition: HERO_POSITIONS[i] || "center 20%" }}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
        {/* dark gradient so the text stays readable on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 md:from-black/70 md:via-black/35 md:to-black/55" />

        <div className="relative z-10 text-center px-5 pb-14 md:pb-0 max-w-3xl w-full">
          <motion.span
            initial={{ opacity: 0, y: -12, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.22em" }}
            transition={{ duration: 1.1 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-gold-200 text-[10px] sm:text-xs md:text-sm uppercase"
          >
            {t.home.heroTag}
          </motion.span>

          <AnimatedText
            as="h1"
            text={t.home.heroTitle}
            delay={0.25}
            highlightLast={2}
            highlightClassName="font-script text-shine-gold text-[1.2em]"
            className="font-serif text-[2.35rem] leading-[1.12] sm:text-5xl md:text-7xl text-white font-bold drop-shadow-lg"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-4 md:mt-6 text-rose-50/90 text-[0.95rem] md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t.home.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="mt-6 md:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
          >
            <Link
              to="/collections"
              className="btn-shine h-12 px-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg shadow-black/20 active:scale-[0.98] md:hover:scale-105 transition-transform duration-300"
            >
              {t.home.ctaShop}
            </Link>
            <Link
              to="/a-propos"
              className="h-12 px-8 inline-flex items-center justify-center rounded-full border border-white/60 text-white font-medium bg-white/5 backdrop-blur-sm active:bg-white/15 md:hover:bg-white/10 transition"
            >
              {t.home.ctaAbout}
            </Link>
          </motion.div>
        </div>

        {HERO_IMAGES.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10" dir="ltr">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={`${i + 1}`}
                className="h-6 flex items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === heroIndex ? "w-8 bg-gold-300" : "w-3 bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* NOTRE UNIVERS (strip) ------------------------------------------------- */}
      <section className="py-9 md:py-14 bg-blush-50/60">
        <Reveal className="text-center mb-5 px-4">
          <h3 className="font-script text-[2rem] md:text-5xl text-rosegold leading-tight">{t.home.stripTitle}</h3>
        </Reveal>
        <ImageMarquee images={strip} />
      </section>

      {/* COLLECTIONS ------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-24">
        <SectionHeading eyebrow={t.nav.collections} title={t.collections.title} subtitle={t.collections.subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {!categoriesLoaded && !categoriesFailed &&
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl shimmer" />)}
          {categoriesLoaded &&
            categories.map((cat, i) => (
              <Reveal key={cat.id} delay={(i % 4) * 0.06}>
                <Link
                  to={`/collections?cat=${cat.id}`}
                  className="group relative block aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-md ring-1 ring-blush-100 bg-gradient-to-br from-blush-100 to-gold-100"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat[lang] || cat.fr}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 md:group-hover:scale-110"
                    />
                  ) : (
                    <HiOutlineSparkles className="absolute inset-0 m-auto text-blush-300" size={44} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <span className="absolute bottom-2.5 start-2.5 end-2.5 text-white font-serif font-bold text-[0.98rem] md:text-xl leading-tight drop-shadow">
                    {cat[lang] || cat.fr}
                  </span>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>

      {/* BEST SELLERS ------------------------------------------------------------ */}
      <section className="bg-gradient-to-b from-white to-blush-50/50 py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="⭐ Top" title={t.home.bestSellers} subtitle={t.home.bestSellersSub} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-7">
            {(bestSellers.length ? bestSellers : products.slice(0, 4)).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <Reveal className="text-center mt-8">
            <Link
              to="/collections"
              className="inline-flex items-center h-12 px-8 rounded-full border border-blush-300 text-blush-700 font-medium active:bg-blush-600 active:text-white md:hover:bg-blush-600 md:hover:text-white md:hover:border-blush-600 transition-all duration-300"
            >
              {t.home.viewAll}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* NEW ARRIVALS ------------------------------------------------------------ */}
      <section className="py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="✨ New" title={t.home.newArrivals} subtitle={t.home.newArrivalsSub} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-7">
            {(newArrivals.length ? newArrivals : products.slice(4, 8)).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <Reveal className="text-center mt-8">
            <Link
              to="/collections"
              className="inline-flex items-center h-12 px-8 rounded-full border border-blush-300 text-blush-700 font-medium active:bg-blush-600 active:text-white md:hover:bg-blush-600 md:hover:text-white md:hover:border-blush-600 transition-all duration-300"
            >
              {t.home.viewAll}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* WHY US ------------------------------------------------------------------ */}
      <section className="relative py-12 md:py-28 bg-[#2b1620] overflow-hidden">
        <div className="absolute -top-20 -start-20 h-72 w-72 rounded-full bg-blush-700/30 blur-3xl" />
        <div className="absolute -bottom-24 -end-24 h-80 w-80 rounded-full bg-gold-700/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading title={t.home.why} light />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {whyItems.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className="text-center p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="h-11 w-11 md:h-14 md:w-14 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-blush-500 flex items-center justify-center mb-3 shadow-lg">
                  <item.icon className="text-white" size={22} />
                </div>
                <h4 className="font-serif font-bold text-[1.05rem] md:text-xl text-white mb-1.5 leading-tight">{item.title}</h4>
                <p className="text-rose-100/70 text-[0.8rem] md:text-sm leading-relaxed">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER TEASER ---------------------------------------------------------- */}
      <section className="py-10 md:py-24 bg-blush-50/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <Reveal className="grid grid-cols-3 gap-2 md:gap-3">
            {ATELIER_GALLERY.slice(0, 3).map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className={`rounded-xl md:rounded-2xl object-cover w-full shadow-md ${i === 1 ? "mt-5 md:mt-8" : ""} h-32 md:h-56`}
              />
            ))}
          </Reveal>
          <Reveal delay={0.1} className="text-center md:text-start">
            <span className="text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase text-blush-500">
              {t.nav.about}
            </span>
            <h3 className="font-serif font-bold text-[1.9rem] md:text-4xl text-blush-900 mt-2 mb-3 leading-tight">
              {t.about.storyTitle}
            </h3>
            <p className="text-stone-500 mb-6 leading-relaxed text-[0.95rem]">{t.about.storyText}</p>
            <Link
              to="/a-propos"
              className="inline-flex items-center h-12 px-8 rounded-full bg-blush-700 text-white font-medium active:bg-blush-800 md:hover:bg-blush-800 transition"
            >
              {t.home.ctaAbout}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CONTACT CALL TO ACTION --------------------------------------------------- */}
      <section className="py-10 md:py-20">
        <Reveal className="max-w-3xl mx-auto text-center px-5">
          <h3 className="font-serif font-bold text-[1.7rem] md:text-3xl text-blush-900 mb-2 leading-tight">
            {t.home.newsletterTitle}
          </h3>
          <p className="text-stone-500 mb-5 text-[0.95rem]">{t.home.newsletterText}</p>
          <Link
            to="/contact"
            className="btn-shine inline-flex items-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-500 to-blush-600 text-white font-semibold shadow-lg active:scale-[0.98] md:hover:scale-105 transition-transform"
          >
            {t.nav.contact}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
