import { useEffect, useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineCheckCircle } from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDeliveryPrices, saveDeliveryPrices } from "../../store/slices/deliverySlice";
import { WILAYAS, DELIVERY_PRICES } from "../../data/algeria";
import ErrorMessage from "../../components/ErrorMessage";

// Delivery prices (Yalidine changes them sometimes): the seller edits them here and
// the checkout page uses these prices straight away.
export default function DashboardDelivery() {
  const { t, lang } = useLang();
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) => state.delivery.prices);
  const status = useAppSelector((state) => state.delivery.status);
  const failed = status === "failed" && Object.keys(saved).length === 0;

  const [prices, setPrices] = useState({}); // what is being edited
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");
  const [bulk, setBulk] = useState({ home: "", stopdesk: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    dispatch(fetchDeliveryPrices());
  }, [dispatch]);

  // copy the saved prices into the editing form (until the seller starts typing)
  useEffect(() => {
    if (dirty) return;
    const source = Object.keys(saved).length ? saved : status === "failed" ? DELIVERY_PRICES : {};
    const copy = {};
    Object.keys(source).forEach((code) => {
      copy[code] = { home: source[code].home, stopdesk: source[code].stopdesk };
    });
    setPrices(copy);
  }, [saved, status, dirty]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return WILAYAS.filter(
      (w) => !q || w.fr.toLowerCase().includes(q) || w.ar.includes(search.trim()) || w.code.includes(q)
    );
  }, [search]);

  function setPrice(code, field, value) {
    setDirty(true);
    setMessage({ type: "", text: "" });
    setPrices((p) => ({ ...p, [code]: { ...p[code], [field]: value === "" ? "" : Number(value) } }));
  }

  // "Apply to all wilayas" for one column
  function applyAll(field) {
    const value = Number(bulk[field]);
    if (!Number.isFinite(value) || bulk[field] === "") return;
    setDirty(true);
    setMessage({ type: "", text: "" });
    setPrices((p) => {
      const next = { ...p };
      WILAYAS.forEach((w) => {
        next[w.code] = { ...next[w.code], [field]: value };
      });
      return next;
    });
  }

  async function handleSave() {
    // empty fields count as 0 and nothing negative is saved
    const clean = {};
    WILAYAS.forEach((w) => {
      const p = prices[w.code] || {};
      clean[w.code] = { home: Math.max(0, Number(p.home) || 0), stopdesk: Math.max(0, Number(p.stopdesk) || 0) };
    });
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await dispatch(saveDeliveryPrices(clean)).unwrap();
      setDirty(false);
      setMessage({ type: "ok", text: t.dashboard.savedSuccess });
    } catch {
      setMessage({ type: "error", text: t.common.error });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-24">
      <h1 className="font-serif font-bold text-2xl md:text-3xl text-blush-900 mb-1">{t.dashboard.deliveryPrices}</h1>
      <p className="text-sm text-stone-500 mb-5">{t.dashboard.deliveryHint}</p>

      {failed && <ErrorMessage onRetry={() => dispatch(fetchDeliveryPrices())} />}

      {/* same price for every wilaya */}
      <div className="p-4 rounded-2xl bg-gold-50/70 border border-gold-100 mb-4">
        <p className="text-sm font-semibold text-stone-700 mb-3">{t.dashboard.applyAll}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {["home", "stopdesk"].map((field) => (
            <div key={field} className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={bulk[field]}
                onChange={(e) => setBulk((b) => ({ ...b, [field]: e.target.value }))}
                placeholder={field === "home" ? t.checkout.home : t.checkout.stopDesk}
                className="input-field flex-1 min-w-0"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => applyAll(field)}
                className="shrink-0 h-12 px-4 rounded-xl border border-gold-400 text-gold-700 text-sm font-semibold active:bg-gold-100"
              >
                {t.dashboard.apply}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mb-3">
        <HiOutlineMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 start-4 text-stone-400" size={20} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.dashboard.searchWilaya}
          className="input-field !ps-12 !rounded-full"
        />
      </div>

      {/* table header (home / stop desk) */}
      <div className="grid grid-cols-[1fr_6.5rem_6.5rem] sm:grid-cols-[1fr_9rem_9rem] gap-2 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
        <span>{t.checkout.wilaya}</span>
        <span className="text-center">{t.checkout.home}</span>
        <span className="text-center">{t.checkout.stopDesk}</span>
      </div>

      <ul className="space-y-2">
        {rows.map((w) => (
          <li
            key={w.code}
            className="grid grid-cols-[1fr_6.5rem_6.5rem] sm:grid-cols-[1fr_9rem_9rem] items-center gap-2 p-2.5 ps-3 rounded-xl bg-white ring-1 ring-blush-100"
          >
            <span className="text-sm text-stone-700 min-w-0 truncate">
              <strong className="text-blush-600">{w.code}</strong> {lang === "ar" ? w.ar : w.fr}
            </span>
            {["home", "stopdesk"].map((field) => (
              <input
                key={field}
                type="number"
                inputMode="numeric"
                min="0"
                value={prices[w.code]?.[field] ?? ""}
                onChange={(e) => setPrice(w.code, field, e.target.value)}
                className="input-field !min-h-11 !px-2 !py-2 text-center"
                dir="ltr"
                aria-label={`${w.fr} — ${field === "home" ? t.checkout.home : t.checkout.stopDesk}`}
              />
            ))}
          </li>
        ))}
        {rows.length === 0 && <li className="p-8 text-center text-stone-400">{t.collections.noResults}</li>}
      </ul>

      {/* save bar */}
      <div className="fixed bottom-0 inset-x-0 lg:start-72 z-30 bg-white/95 backdrop-blur border-t border-blush-100 p-3 pb-safe flex items-center gap-3">
        <div className="flex-1 min-w-0 text-sm">
          {message.text && (
            <span className={`flex items-center gap-1.5 ${message.type === "ok" ? "text-emerald-600" : "text-rose-600"}`} role="status">
              {message.type === "ok" && <HiOutlineCheckCircle size={18} />} {message.text}
            </span>
          )}
          {!message.text && dirty && <span className="text-gold-700">{t.dashboard.unsavedChanges}</span>}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          className="btn-shine h-12 px-7 rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold disabled:opacity-50"
        >
          {saving ? t.common.loading : t.common.save}
        </button>
      </div>
    </div>
  );
}
