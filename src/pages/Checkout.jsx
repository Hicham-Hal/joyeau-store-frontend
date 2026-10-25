import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineUser, HiOutlinePhone, HiOutlineMapPin, HiOutlineTruck } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { useAppDispatch, useAppSelector, useCart, useStoreStatus } from "../store/hooks";
import { WILAYAS, COMMUNES_BY_WILAYA, DELIVERY_PRICES } from "../data/algeria";
import { formatPrice } from "../components/PriceTag";
import { createOrder } from "../store/slices/ordersSlice";
import { fetchDeliveryPrices } from "../store/slices/deliverySlice";
import CheckoutSteps from "../components/CheckoutSteps";
import Reveal from "../components/Reveal";

// Algerian mobile numbers: 05 / 06 / 07 + 8 digits (or +213 5/6/7 ...)
const PHONE_REGEX = /^(0|\+213)[5-7]\d{8}$/;

// STEP 1 of the order: the customer fills her information and sends the order.
// The order arrives in the seller dashboard as "non payée". Step 2 (the confirmation
// deposit: online or via la poste) is the PaymentStep page.
export default function Checkout() {
  const { t, lang } = useLang();
  const { items, subtotal, clearCart } = useCart();
  const { isOpen: storeOpen } = useStoreStatus();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const livePrices = useAppSelector((state) => state.delivery.prices);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilayaCode: "",
    commune: "",
    deliveryType: "home",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    dispatch(fetchDeliveryPrices());
  }, [dispatch]);

  // prices edited by the seller; the built-in table is only a fallback
  const priceTable = Object.keys(livePrices).length ? livePrices : DELIVERY_PRICES;
  const communes = form.wilayaCode ? COMMUNES_BY_WILAYA[form.wilayaCode] || [] : [];
  const deliveryPriceSet = form.wilayaCode ? priceTable[form.wilayaCode] : null;
  const deliveryPrice = deliveryPriceSet
    ? form.deliveryType === "home"
      ? deliveryPriceSet.home
      : deliveryPriceSet.stopdesk
    : 0;
  const totalDue = useMemo(() => subtotal + deliveryPrice, [subtotal, deliveryPrice]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = t.checkout.requiredField;
    if (!form.lastName.trim()) e.lastName = t.checkout.requiredField;
    if (!PHONE_REGEX.test(form.phone.replace(/\s/g, ""))) e.phone = t.checkout.invalidPhone;
    if (!form.wilayaCode) e.wilayaCode = t.checkout.requiredField;
    if (!form.commune) e.commune = t.checkout.requiredField;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0 || !storeOpen) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    const wilaya = WILAYAS.find((w) => w.code === form.wilayaCode);
    try {
      const order = await dispatch(
        createOrder({
          items,
          customer: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: form.phone.replace(/\s/g, ""),
            wilaya: wilaya ? wilaya[lang === "ar" ? "ar" : "fr"] : "",
            wilayaCode: form.wilayaCode,
            commune: form.commune,
            deliveryType: form.deliveryType,
          },
          deliveryCompany: "Yalidine",
          productsTotal: subtotal,
          deliveryPrice,
          totalDue,
          status: "unpaid", // becomes "confirmed" / "pending" once the deposit is paid (step 2)
          paid: false,
        })
      ).unwrap();
      clearCart();
      navigate(`/commande/paiement/${order.orderNumber}`);
    } catch {
      // the cart is kept, so the customer can simply try again
      setSubmitError(t.common.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-6">{t.cart.empty}</p>
        <Link to="/collections" className="inline-flex items-center h-12 px-7 rounded-full bg-blush-700 text-white font-medium">
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-20">
      <Reveal className="text-center mb-5 md:mb-8">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-blush-500">{t.cart.checkout}</span>
        <h1 className="font-serif font-bold text-[2rem] md:text-5xl text-blush-900 mt-1 leading-tight">{t.checkout.title}</h1>
      </Reveal>

      <CheckoutSteps current={1} />

      <form onSubmit={handleSubmit} noValidate className="grid lg:grid-cols-3 gap-5 lg:gap-10">
        <div className="lg:col-span-2 space-y-5">
          {/* Customer info */}
          <section className="p-4 md:p-6 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-blush-900 mb-4 flex items-center gap-2">
              <HiOutlineUser className="text-blush-500" /> {t.checkout.customerInfo}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t.checkout.firstName} error={errors.firstName}>
                <input
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  autoComplete="given-name"
                  className="input-field"
                />
              </Field>
              <Field label={t.checkout.lastName} error={errors.lastName}>
                <input
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  autoComplete="family-name"
                  className="input-field"
                />
              </Field>
              <Field label={t.checkout.phone} error={errors.phone} full>
                <div className="relative">
                  {/* the icon sits on the left, the number starts well after it */}
                  <HiOutlinePhone className="absolute top-1/2 -translate-y-1/2 left-4 text-stone-400 pointer-events-none" size={20} />
                  <input
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value.replace(/[^0-9+\s]/g, ""))}
                    placeholder="05 XX XX XX XX"
                    maxLength={16}
                    className="input-field !ps-14"
                  />
                </div>
              </Field>
            </div>
          </section>

          {/* Delivery */}
          <section className="p-4 md:p-6 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-blush-900 mb-4 flex items-center gap-2">
              <HiOutlineMapPin className="text-blush-500" /> {t.checkout.deliveryCompany}: Yalidine
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t.checkout.wilaya} error={errors.wilayaCode}>
                <select
                  value={form.wilayaCode}
                  onChange={(e) => {
                    update("wilayaCode", e.target.value);
                    setForm((f) => ({ ...f, commune: "" }));
                  }}
                  className="input-field"
                >
                  <option value="">—</option>
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} — {lang === "ar" ? w.ar : w.fr}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.checkout.commune} error={errors.commune}>
                <select
                  value={form.commune}
                  onChange={(e) => update("commune", e.target.value)}
                  disabled={!form.wilayaCode}
                  className="input-field disabled:opacity-50"
                >
                  <option value="">{form.wilayaCode ? "—" : t.checkout.selectWilayaFirst}</option>
                  {communes.map((c) => (
                    <option key={c.fr} value={c.fr}>
                      {lang === "ar" ? c.ar : c.fr}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <HiOutlineTruck /> {t.checkout.deliveryType}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <DeliveryOption
                  active={form.deliveryType === "home"}
                  onClick={() => update("deliveryType", "home")}
                  label={t.checkout.home}
                  price={deliveryPriceSet?.home}
                  dzd={t.common.dzd}
                />
                <DeliveryOption
                  active={form.deliveryType === "stopdesk"}
                  onClick={() => update("deliveryType", "stopdesk")}
                  label={t.checkout.stopDesk}
                  price={deliveryPriceSet?.stopdesk}
                  dzd={t.common.dzd}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit p-4 md:p-6 rounded-2xl bg-blush-50 border border-blush-100 lg:sticky lg:top-24 space-y-3.5">
          <h3 className="font-serif font-bold text-xl text-blush-900">{t.checkout.orderSummary}</h3>
          {items.map((it) => (
            <div key={it.key} className="flex gap-3 items-center text-sm">
              <img src={it.image} alt="" className="h-14 w-11 object-cover object-top rounded-lg bg-white" />
              <div className="flex-1 min-w-0">
                <p className="line-clamp-1 text-stone-700">{it.name[lang]}</p>
                <p className="text-xs text-stone-400">
                  {it.size || "—"} • {it.color || "—"} • x{it.quantity}
                </p>
                {it.bodyNote && <p className="text-[11px] text-stone-400 italic line-clamp-1">{it.bodyNote}</p>}
              </div>
              <span className="font-medium text-blush-700 whitespace-nowrap">{formatPrice(it.price * it.quantity)}</span>
            </div>
          ))}
          <div className="h-px bg-blush-200" />
          <div className="flex justify-between text-sm text-stone-500">
            <span>{t.checkout.productsTotal}</span>
            <span>
              {formatPrice(subtotal)} {t.common.dzd}
            </span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>{t.checkout.deliveryPrice}</span>
            <span>{deliveryPrice ? `${formatPrice(deliveryPrice)} ${t.common.dzd}` : "—"}</span>
          </div>
          <div className="h-px bg-blush-200" />
          <div className="flex justify-between font-semibold text-blush-800 text-lg">
            <span>{t.checkout.totalDue}</span>
            <span>
              {formatPrice(totalDue)} {t.common.dzd}
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">{t.checkout.nextStepNote}</p>

          <button
            type="submit"
            disabled={submitting || !storeOpen}
            className="btn-shine w-full min-h-[52px] rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg active:scale-[0.99] transition disabled:opacity-60"
          >
            {submitting ? t.common.loading : t.checkout.submitOrder}
          </button>
          {!storeOpen && <p className="text-xs text-rose-600 text-center">{t.storeClosed.text}</p>}
          {submitError && (
            <p className="text-xs text-rose-600 text-center" role="alert">
              {submitError}
            </p>
          )}
        </aside>
      </form>
    </div>
  );
}

function Field({ label, children, error, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

function DeliveryOption({ active, onClick, label, price, dzd }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between gap-3 px-4 min-h-[52px] rounded-xl border-2 transition ${
        active ? "border-blush-600 bg-blush-50" : "border-blush-100 active:border-blush-300"
      }`}
    >
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <span className="text-sm font-semibold text-blush-700 whitespace-nowrap">
        {price ? `${formatPrice(price)} ${dzd}` : "—"}
      </span>
    </button>
  );
}
