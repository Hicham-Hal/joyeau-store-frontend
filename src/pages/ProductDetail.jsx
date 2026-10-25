import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineShoppingBag,
  HiOutlineBolt,
  HiOutlineClock,
  HiArrowLeft,
  HiArrowRight,
  HiOutlinePlayCircle,
  HiOutlineXMark,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import {
  useAppDispatch,
  useAppSelector,
  useCart,
  useCategoryLabel,
  useStoreStatus,
} from "../store/hooks";
import { fetchProductById, fetchProducts } from "../store/slices/productsSlice";
import PriceTag from "../components/PriceTag";
import ProductCard from "../components/ProductCard";
import ErrorMessage from "../components/ErrorMessage";

const BODY_NOTE_MAX = 500;

// Picture or video (used in the main viewer and in the full-screen view)
function MediaView({ media, alt, className, controls = false }) {
  if (!media) return null;
  if (media.type === "video") {
    return (
      <video
        key={media.url}
        src={media.url}
        className={className}
        controls={controls}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return <img key={media.url} src={media.url} alt={alt} className={className} decoding="async" />;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, isAr } = useLang();
  const { addToCart } = useCart();
  const { isOpen: storeOpen } = useStoreStatus();
  const getCategoryLabel = useCategoryLabel();

  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.products.current);
  const currentStatus = useAppSelector((state) => state.products.currentStatus);
  const allProducts = useAppSelector((state) => state.products.items);
  const loading = currentStatus === "idle" || currentStatus === "loading";

  const related = useMemo(
    () =>
      product
        ? allProducts.filter((x) => x.category === product.category && String(x.id) !== String(product.id)).slice(0, 4)
        : [],
    [allProducts, product]
  );

  // pictures / video of the product (the "gallery")
  const gallery = useMemo(() => {
    if (!product) return [];
    const list = (product.images || []).map((url) => ({ url, type: "image" }));
    if (product.video) list.push({ url: product.video, type: "video" });
    return list;
  }, [product]);

  const [viewer, setViewer] = useState(null); // what the big picture shows (null = first of the gallery)
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bodyNote, setBodyNote] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProducts()); // cached list, used for "related products"
    setViewer(null);
    setZoom(false);
    setSize(null);
    setColor(null);
    setQuantity(1);
    setBodyNote("");
    setNotice("");
  }, [id, dispatch]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-24 text-center text-stone-400">{t.common.loading}</div>;
  }

  if (currentStatus === "failed") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24">
        <ErrorMessage onRetry={() => dispatch(fetchProductById(id))} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-stone-500 mb-6">404</p>
        <Link to="/collections" className="text-blush-600 underline">
          {t.product.back}
        </Link>
      </div>
    );
  }

  const ArrowBack = isAr ? HiArrowRight : HiArrowLeft;
  const colorObj = product.colors.find((c) => c.name === color) || null;
  const shown = viewer || gallery[0] || (colorObj?.url ? { url: colorObj.url, type: colorObj.type } : null);

  function chooseColor(c) {
    setColor(c.name);
    setNotice("");
    // the customer sees the dress in the color she just chose
    if (c.url) setViewer({ url: c.url, type: c.type });
  }

  function validateSelection() {
    if (product.sizes.length && !size) {
      setNotice(t.product.selectSize);
      return false;
    }
    if (product.colors.length && !color) {
      setNotice(t.product.selectColor);
      return false;
    }
    return true;
  }

  function addCurrentToCart() {
    addToCart(product, {
      size,
      color,
      quantity,
      bodyNote,
      // in the cart, show the picture of the chosen color when there is one
      image: colorObj?.url && colorObj.type === "image" ? colorObj.url : undefined,
    });
  }

  function handleAddToCart() {
    if (!validateSelection()) return;
    addCurrentToCart();
    setNotice(t.product.addedToCart);
  }

  function handleBuyNow() {
    if (!validateSelection()) return;
    addCurrentToCart();
    navigate("/panier");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-14">
      <button
        onClick={() => navigate("/collections")}
        className="flex items-center gap-2 h-10 text-sm text-stone-500 active:text-blush-700 md:hover:text-blush-700 mb-3 md:mb-6"
      >
        <ArrowBack size={16} /> {t.product.back}
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-14">
        {/* ---------- Pictures: small main picture, thumbnails under it ---------- */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="mx-auto w-full max-w-[17.5rem] sm:max-w-xs md:max-w-sm">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-blush-50 shadow-md ring-1 ring-blush-100">
              <AnimatePresence mode="wait">
                {shown ? (
                  <motion.div
                    key={shown.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <MediaView media={shown} alt={product.name[lang]} className="h-full w-full object-cover object-top" />
                  </motion.div>
                ) : (
                  <div className="h-full w-full" />
                )}
              </AnimatePresence>

              {product.isBestSeller && (
                <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-gold-500 text-white text-[10px] font-semibold uppercase">
                  {t.common.bestseller}
                </span>
              )}
              {shown && (
                <button
                  onClick={() => setZoom(true)}
                  className="absolute bottom-3 end-3 h-10 w-10 rounded-full bg-black/45 text-white flex items-center justify-center backdrop-blur-sm active:bg-black/65"
                  aria-label={t.product.zoom}
                >
                  <HiOutlineArrowsPointingOut size={20} />
                </button>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center scrollbar-none">
                {gallery.map((m, i) => (
                  <button
                    key={`${i}-${m.url.slice(0, 30)}`}
                    onClick={() => setViewer(m)}
                    className={`relative h-16 w-14 shrink-0 rounded-lg overflow-hidden ring-2 transition ${
                      shown?.url === m.url ? "ring-blush-600" : "ring-transparent opacity-70"
                    }`}
                    aria-label={`${i + 1}`}
                  >
                    {m.type === "video" ? (
                      <span className="h-full w-full bg-blush-900 text-white flex items-center justify-center">
                        <HiOutlinePlayCircle size={26} />
                      </span>
                    ) : (
                      <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------ Info ------------------------------ */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gold-600 font-semibold mb-1">
            {getCategoryLabel(product.category, lang)}
          </p>
          <h1 className="font-serif font-bold text-[1.9rem] md:text-4xl text-blush-900 mb-2 leading-tight">
            {product.name[lang]}
          </h1>
          <PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" />

          <div className="flex items-center gap-2 mt-3 text-sm text-stone-500">
            <HiOutlineClock className="text-blush-500" />
            {t.product.prepTime}: <strong className="text-blush-700">{product.prepDays} {t.product.days}</strong>
          </div>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-stone-700 mb-2">{t.product.size}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setNotice("");
                    }}
                    className={`h-11 min-w-11 px-3 rounded-full border text-sm font-medium transition ${
                      size === s
                        ? "bg-blush-700 text-white border-blush-700"
                        : "bg-white border-blush-200 text-stone-600 active:border-blush-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors: choosing one shows the dress in this color */}
          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-stone-700 mb-2">
                {t.product.color}
                {color && <span className="font-normal text-blush-700"> — {color}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => chooseColor(c)}
                    className={`inline-flex items-center gap-2 h-11 ps-1.5 pe-4 rounded-full border text-sm font-medium transition ${
                      color === c.name
                        ? "bg-blush-700 text-white border-blush-700"
                        : "bg-white border-blush-200 text-stone-600 active:border-blush-400"
                    }`}
                  >
                    <span className="h-8 w-8 rounded-full overflow-hidden bg-blush-100 ring-1 ring-black/5 flex items-center justify-center shrink-0">
                      {c.url && c.type === "image" && (
                        <img src={c.url} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                      )}
                      {c.url && c.type === "video" && <HiOutlinePlayCircle size={18} className="text-blush-600" />}
                    </span>
                    {c.name}
                  </button>
                ))}
              </div>
              {product.colors.some((c) => c.url) && (
                <p className="text-xs text-stone-400 mt-2">{t.product.colorHint}</p>
              )}
            </div>
          )}

          {/* Body description */}
          <div className="mt-5">
            <label htmlFor="body-note" className="block text-sm font-semibold text-stone-700 mb-1">
              {t.product.bodyTitle}
            </label>
            <p className="text-xs text-stone-400 mb-2">{t.product.bodyHint}</p>
            <textarea
              id="body-note"
              value={bodyNote}
              onChange={(e) => setBodyNote(e.target.value.slice(0, BODY_NOTE_MAX))}
              rows={3}
              placeholder={t.product.bodyPlaceholder}
              className="input-field resize-none"
            />
            <p className="text-[11px] text-stone-400 mt-1 text-end" dir="ltr">
              {bodyNote.length}/{BODY_NOTE_MAX}
            </p>
          </div>

          {/* Quantity */}
          <div className="mt-4 flex items-center gap-4">
            <p className="text-sm font-semibold text-stone-700">{t.product.quantity}</p>
            <div className="inline-flex items-center border border-blush-200 rounded-full overflow-hidden bg-white">
              <button className="w-11 h-11 active:bg-blush-50" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button className="w-11 h-11 active:bg-blush-50" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          {notice && (
            <motion.p
              key={notice}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-blush-600 font-medium"
              role="status"
            >
              {notice}
            </motion.p>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              disabled={!storeOpen}
              onClick={handleAddToCart}
              className="btn-shine flex-1 flex items-center justify-center gap-2 h-13 min-h-[52px] px-6 rounded-full border-2 border-blush-600 text-blush-700 font-semibold active:bg-blush-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HiOutlineShoppingBag size={20} /> {t.product.addToCart}
            </button>
            <button
              disabled={!storeOpen}
              onClick={handleBuyNow}
              className="btn-shine flex-1 flex items-center justify-center gap-2 min-h-[52px] px-6 rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg shadow-blush-300/50 active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HiOutlineBolt size={20} /> {t.product.buyNow}
            </button>
          </div>
          {!storeOpen && <p className="mt-3 text-sm text-rose-600 font-medium">{t.storeClosed.text}</p>}

          {/* Description */}
          <div className="mt-7 p-4 md:p-5 rounded-2xl bg-blush-50 border border-blush-100">
            <h3 className="font-serif font-bold text-lg text-blush-900 mb-1.5">{t.product.description}</h3>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.description?.[lang] || t.product.descPlaceholder}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12 md:mt-24">
          <h3 className="font-serif font-bold text-[1.7rem] md:text-3xl text-blush-900 mb-5 md:mb-8 text-center">
            {t.product.related}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-7">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Full-screen view (tap the zoom button) */}
      <AnimatePresence>
        {zoom && shown && (
          <motion.div
            className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
          >
            <button
              className="absolute top-3 end-3 h-11 w-11 rounded-full bg-white/15 text-white flex items-center justify-center"
              aria-label={t.common.close}
            >
              <HiOutlineXMark size={26} />
            </button>
            <MediaView media={shown} alt={product.name[lang]} controls className="max-h-[92dvh] max-w-full rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
