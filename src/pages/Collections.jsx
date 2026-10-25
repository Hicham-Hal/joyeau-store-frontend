import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineMagnifyingGlass as HiOutlineSearch, HiOutlineAdjustmentsHorizontal, HiOutlineXMark as HiOutlineX } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { useAppDispatch, useAppSelector, useCategories } from "../store/hooks";
import { fetchProducts } from "../store/slices/productsSlice";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import ErrorMessage from "../components/ErrorMessage";

export default function Collections() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);
  const loading = (status === "idle" || status === "loading") && products.length === 0;
  const failed = status === "failed" && products.length === 0;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(null); // null = no price limit
  const { categories } = useCategories();
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = params.get("cat") || "all";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  function setCategory(id) {
    if (id === "all") {
      params.delete("cat");
    } else {
      params.set("cat", id);
    }
    setParams(params, { replace: true });
  }

  // the slider goes up to the most expensive product (rounded up to 5 000)
  const priceCeiling = useMemo(
    () => Math.max(10000, Math.ceil(Math.max(0, ...products.map((p) => p.price)) / 5000) * 5000),
    [products]
  );
  const priceLimit = maxPrice ?? priceCeiling;

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.fr.toLowerCase().includes(q) || p.name.ar.includes(q)
      );
    }
    list = list.filter((p) => p.price <= priceLimit);
    if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [products, activeCategory, search, sort, priceLimit]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-20">
      <Reveal className="text-center mb-6 md:mb-10">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-blush-500">
          {t.nav.collections}
        </span>
        <h1 className="font-serif font-bold text-[2rem] md:text-5xl text-blush-900 mt-1 leading-tight">{t.collections.title}</h1>
        <p className="text-stone-500 mt-2 max-w-xl mx-auto text-sm md:text-base">{t.collections.subtitle}</p>
      </Reveal>

      {/* search + sort bar */}
      <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 mb-4 md:mb-8">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute top-1/2 -translate-y-1/2 start-4 text-stone-400" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.collections.searchPlaceholder}
            className="w-full h-12 rounded-full border border-blush-200 bg-white ps-11 pe-4 text-base focus:outline-none focus:ring-2 focus:ring-blush-300"
          />
        </div>
        <div className="flex gap-2.5 md:gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 md:flex-none h-12 rounded-full border border-blush-200 bg-white px-4 text-base focus:outline-none focus:ring-2 focus:ring-blush-300"
          >
            <option value="default">{t.collections.sort.default}</option>
            <option value="priceAsc">{t.collections.sort.priceAsc}</option>
            <option value="priceDesc">{t.collections.sort.priceDesc}</option>
            <option value="newest">{t.collections.sort.newest}</option>
          </select>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center justify-center gap-2 h-12 min-w-12 rounded-full border border-blush-200 bg-white px-4 text-sm active:bg-blush-50 md:hover:bg-blush-50"
          >
            <HiOutlineAdjustmentsHorizontal size={18} />
            <span className="hidden sm:inline">{t.collections.filterPrice}</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-5 md:mb-8 p-4 rounded-2xl bg-blush-50 border border-blush-100 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm text-stone-600 whitespace-nowrap">{t.collections.filterPrice}</span>
          <input
            type="range"
            min="5000"
            max={priceCeiling}
            step="1000"
            value={priceLimit}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1 min-w-40 h-8 accent-blush-600"
          />
          <span className="text-sm font-semibold text-blush-700 whitespace-nowrap">
            {new Intl.NumberFormat("fr-FR").format(priceLimit)} {t.common.dzd}
          </span>
        </div>
      )}

      {/* category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        <button
          onClick={() => setCategory("all")}
          className={`shrink-0 h-11 px-5 rounded-full text-sm font-medium border transition ${
            activeCategory === "all"
              ? "bg-blush-700 text-white border-blush-700"
              : "bg-white text-stone-600 border-blush-200 hover:bg-blush-50"
          }`}
        >
          {t.collections.filterAll}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 h-11 px-5 rounded-full text-sm font-medium border transition ${
              activeCategory === cat.id
                ? "bg-blush-700 text-white border-blush-700"
                : "bg-white text-stone-600 border-blush-200 hover:bg-blush-50"
            }`}
          >
            {cat[lang] || cat.fr}
          </button>
        ))}
      </div>

      {search && (
        <div className="mb-6 flex items-center gap-2 text-sm text-stone-500">
          <span>
            "{search}" — {filtered.length} {t.collections.results}
          </span>
          <button onClick={() => setSearch("")} className="text-blush-600 flex items-center gap-1">
            <HiOutlineX size={14} /> {t.common.cancel}
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl shimmer" />
          ))}
        </div>
      ) : failed ? (
        <ErrorMessage onRetry={() => dispatch(fetchProducts({ force: true }))} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">{t.collections.noResults}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-7">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
