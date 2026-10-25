import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineArrowUpTray,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { payOrder } from "../store/slices/ordersSlice";
import { payWithSofizPay } from "../services/paymentService";
import { uploadFile } from "../services/uploadService";
import { formatPrice } from "../components/PriceTag";
import CheckoutSteps from "../components/CheckoutSteps";
import Modal from "../components/Modal";
import Reveal from "../components/Reveal";

const DEPOSIT_OPTIONS = [1000, 1500, 2000];

// STEP 2 of the order: "acompte de confirmation".
//   online      -> the order is confirmed automatically
//   via la poste -> the customer sends the receipt, the seller confirms by hand
export default function PaymentStep() {
  const { orderNumber } = useParams();
  const { t } = useLang();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const order = useAppSelector((state) => state.orders.current);

  const [deposit, setDeposit] = useState(1000);
  const [method, setMethod] = useState("online");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptBusy, setReceiptBusy] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", otp: "" });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  // the order of this browser is kept in the store (and survives a refresh)
  if (!order || order.orderNumber !== orderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-6">{t.payment.orderNotFound}</p>
        <Link to="/collections" className="inline-flex items-center h-12 px-7 rounded-full bg-blush-700 text-white font-medium">
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  // already paid -> nothing left to do here
  if (order.status !== "unpaid") {
    return <Navigate to={`/commande/confirmation/${order.orderNumber}`} replace />;
  }

  async function handleReceipt(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setReceiptBusy(true);
    setError("");
    try {
      const uploaded = await uploadFile(file);
      setReceiptUrl(uploaded.url);
    } catch {
      setError(t.upload.failed);
    } finally {
      setReceiptBusy(false);
    }
  }

  async function finish(payment) {
    setError("");
    try {
      await dispatch(payOrder({ id: order.id, payment })).unwrap();
      navigate(`/commande/confirmation/${order.orderNumber}`, { replace: true });
    } catch {
      setError(t.common.error);
    }
  }

  async function handleContinue() {
    if (method === "online") {
      setCardOpen(true);
      return;
    }
    if (!receiptUrl) {
      setError(t.checkout.requiredField);
      return;
    }
    setPaying(true);
    await finish({ paymentMethod: "post", deposit, receiptImage: receiptUrl });
    setPaying(false);
  }

  async function handleCardPay(e) {
    e.preventDefault();
    setPaying(true);
    try {
      // DEMO: simulated card payment. The real flow redirects to the SofizPay page.
      await payWithSofizPay({
        amount: deposit,
        fullName: `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim(),
        phone: order.customer?.phone,
      });
      setCardOpen(false);
      await finish({ paymentMethod: "online", deposit });
    } catch {
      setCardOpen(false);
      setError(t.common.error);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <Reveal className="text-center mb-5 md:mb-8">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-blush-500">{t.orderSuccess.orderNumber}</span>
        <p className="font-serif font-bold text-2xl text-blush-800 mt-1" dir="ltr">
          {order.orderNumber}
        </p>
        <h1 className="font-serif font-bold text-[1.9rem] md:text-4xl text-blush-900 mt-2 leading-tight">
          {t.checkout.depositTitle}
        </h1>
      </Reveal>

      <CheckoutSteps current={2} />

      {/* the order has been sent */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm mb-5">
        <HiOutlineCheckCircle size={22} className="shrink-0 mt-0.5" />
        <p>{t.payment.orderSent}</p>
      </div>

      <section className="p-4 md:p-6 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm space-y-6">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">{t.checkout.totalDue}</span>
          <strong className="text-blush-800">
            {formatPrice(order.totalDue)} {t.common.dzd}
          </strong>
        </div>

        <div>
          <p className="text-sm text-stone-500 mb-4">{t.checkout.depositText}</p>
          <p className="text-sm font-semibold text-stone-700 mb-2">{t.checkout.chooseDeposit}</p>
          <div className="grid grid-cols-3 gap-2">
            {DEPOSIT_OPTIONS.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDeposit(d)}
                className={`min-h-[48px] rounded-full border text-sm font-semibold transition ${
                  deposit === d ? "bg-blush-700 text-white border-blush-700" : "bg-white border-blush-200 text-stone-600"
                }`}
              >
                {formatPrice(d)}
                <span className="text-[10px] font-medium opacity-80"> {t.common.dzd}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2">{t.checkout.remainingNote}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-700 mb-2">{t.checkout.paymentMethod}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <PaymentOption
              active={method === "online"}
              onClick={() => setMethod("online")}
              icon={HiOutlineCreditCard}
              title={t.checkout.payOnline}
              text={t.checkout.payOnlineText}
            />
            <PaymentOption
              active={method === "post"}
              onClick={() => setMethod("post")}
              icon={HiOutlineBanknotes}
              title={t.checkout.payPost}
              text={t.checkout.payPostText}
            />
          </div>

          <AnimatePresence initial={false}>
            {method === "post" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-blush-200 bg-blush-50 text-center">
                  <button
                    type="button"
                    disabled={receiptBusy}
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-white border border-blush-300 text-blush-700 text-sm font-semibold active:bg-blush-100 disabled:opacity-60"
                  >
                    <HiOutlineArrowUpTray size={20} />
                    {receiptBusy ? t.upload.uploading : t.checkout.uploadReceipt}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleReceipt} />
                  {receiptUrl && <img src={receiptUrl} alt="receipt" className="mx-auto mt-3 max-h-48 object-contain rounded-lg" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <p className="text-sm text-rose-600 text-center" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={paying || receiptBusy}
          className="btn-shine w-full min-h-[54px] rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg active:scale-[0.99] transition disabled:opacity-60"
        >
          {paying ? t.common.loading : `${method === "online" ? t.payment.payNow : t.payment.sendReceipt} — ${formatPrice(deposit)} ${t.common.dzd}`}
        </button>

        <Link
          to={`/commande/confirmation/${order.orderNumber}`}
          className="block text-center text-sm text-stone-400 underline underline-offset-4 py-1"
        >
          {t.payment.payLater}
        </Link>
      </section>

      {/* Online payment (simulation) */}
      <Modal open={cardOpen} onClose={() => !paying && setCardOpen(false)} title="SofizPay" maxWidth="max-w-md">
        <span className="inline-block text-xs px-2 py-0.5 rounded bg-gold-100 text-gold-700 font-semibold mb-1">
          Carte Dahabiya / CIB
        </span>
        <p className="text-sm text-stone-500 mb-4">
          {formatPrice(deposit)} {t.common.dzd} — {t.checkout.depositTitle}
        </p>
        {!paying ? (
          <form onSubmit={handleCardPay} className="space-y-3">
            <input
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder={t.payment.cardNumber}
              value={card.number}
              onChange={(e) => setCard((f) => ({ ...f, number: e.target.value.replace(/\D/g, "") }))}
              maxLength={16}
              className="input-field"
              dir="ltr"
            />
            <input
              required
              placeholder={t.payment.cardName}
              value={card.name}
              onChange={(e) => setCard((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder={t.payment.cardExpiry}
                value={card.expiry}
                onChange={(e) => setCard((f) => ({ ...f, expiry: e.target.value }))}
                className="input-field"
                dir="ltr"
              />
              <input
                required
                inputMode="numeric"
                placeholder={t.payment.cardOtp}
                value={card.otp}
                onChange={(e) => setCard((f) => ({ ...f, otp: e.target.value.replace(/\D/g, "") }))}
                className="input-field"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              className="btn-shine w-full min-h-[52px] rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold mt-1"
            >
              {t.payment.pay} {formatPrice(deposit)} {t.common.dzd}
            </button>
            <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
              <HiOutlineShieldCheck size={14} /> {t.payment.demoNote}
            </p>
          </form>
        ) : (
          <div className="py-10 flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-10 w-10 border-4 border-blush-200 border-t-blush-600 rounded-full"
            />
            <p className="text-sm text-stone-500">{t.payment.processing}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PaymentOption({ active, onClick, icon: Icon, title, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-start p-4 rounded-xl border-2 transition relative ${
        active ? "border-blush-600 bg-blush-50" : "border-blush-100 active:border-blush-300"
      }`}
    >
      {active && <HiOutlineCheckCircle className="absolute top-3 end-3 text-blush-600" size={20} />}
      <Icon className="text-blush-500 mb-1.5" size={24} />
      <p className="font-semibold text-sm text-stone-800 mb-1">{title}</p>
      <p className="text-xs text-stone-500 leading-relaxed">{text}</p>
    </button>
  );
}
