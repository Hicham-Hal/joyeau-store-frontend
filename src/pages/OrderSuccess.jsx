import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationCircle } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { useAppSelector } from "../store/hooks";
import { formatPrice } from "../components/PriceTag";

// Three cases:
//   confirmed  -> paid online, the order is confirmed automatically
//   pending    -> paid via la poste, waiting for the seller to check the receipt
//   unpaid     -> the order was sent but the deposit is not paid yet
export default function OrderSuccess() {
  const { t } = useLang();
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const current = useAppSelector((s) => s.orders.current);
  const order = current && current.orderNumber === orderNumber ? current : state?.order;

  const status = order?.status || "pending";
  const view =
    status === "confirmed"
      ? { icon: HiOutlineCheckCircle, tone: "bg-emerald-50 text-emerald-500", title: t.orderSuccess.onlineTitle, text: t.orderSuccess.onlineText }
      : status === "unpaid"
        ? { icon: HiOutlineExclamationCircle, tone: "bg-rose-50 text-rose-400", title: t.orderSuccess.unpaidTitle, text: t.orderSuccess.unpaidText }
        : { icon: HiOutlineClock, tone: "bg-gold-50 text-gold-600", title: t.orderSuccess.postTitle, text: t.orderSuccess.postText };
  const Icon = view.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-28 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 12 }}
        className={`mx-auto mb-5 h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center ${view.tone}`}
      >
        <Icon size={52} />
      </motion.div>

      <h1 className="font-serif font-bold text-[1.8rem] md:text-4xl text-blush-900 mb-3 leading-tight">{view.title}</h1>
      <p className="text-stone-500 mb-6 leading-relaxed text-[0.95rem]">{view.text}</p>

      <div className="inline-flex flex-col items-center gap-1 px-7 py-4 rounded-2xl bg-blush-50 border border-blush-100 mb-6">
        <span className="text-xs uppercase tracking-wide text-stone-400">{t.orderSuccess.orderNumber}</span>
        <span className="font-serif font-bold text-2xl text-blush-800" dir="ltr">
          {orderNumber}
        </span>
        {order && (
          <span className="text-sm text-stone-500 mt-2">
            {t.checkout.totalDue}:{" "}
            <strong>
              {formatPrice(order.totalDue)} {t.common.dzd}
            </strong>
          </span>
        )}
        {order?.deposit ? (
          <span className="text-sm text-stone-500">
            {t.checkout.depositTitle}:{" "}
            <strong>
              {formatPrice(order.deposit)} {t.common.dzd}
            </strong>
          </span>
        ) : null}
      </div>

      <p className="text-sm text-stone-400 mb-8">{t.orderSuccess.trackText}</p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        {status === "unpaid" && (
          <Link
            to={`/commande/paiement/${orderNumber}`}
            className="btn-shine inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold shadow-lg"
          >
            {t.orderSuccess.payNow}
          </Link>
        )}
        <Link
          to="/"
          className={`inline-flex items-center justify-center min-h-[52px] px-8 rounded-full font-semibold ${
            status === "unpaid"
              ? "border border-blush-300 text-blush-700"
              : "btn-shine bg-gradient-to-r from-blush-600 to-gold-500 text-white shadow-lg"
          }`}
        >
          {t.orderSuccess.backHome}
        </Link>
      </div>
    </div>
  );
}
