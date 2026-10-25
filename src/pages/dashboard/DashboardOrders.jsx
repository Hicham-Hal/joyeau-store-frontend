import { useEffect, useMemo, useState } from "react";
import {
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineTruck,
  HiOutlineArrowUturnLeft,
} from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOrders, updateOrderStatus } from "../../store/slices/ordersSlice";
import { formatPrice } from "../../components/PriceTag";
import Modal from "../../components/Modal";
import ErrorMessage from "../../components/ErrorMessage";
import { ORDER_STATUS_BADGE } from "./orderStatus";

// Order life cycle:
//   unpaid    -> the customer sent the order but has not paid the deposit yet
//   pending   -> paid via la poste: the seller checks the receipt and confirms by hand
//   confirmed -> paid online (automatic) or confirmed by the seller
//   refused   -> refused by the seller
const TABS = [
  { id: "unpaid", match: (o) => o.status === "unpaid" },
  { id: "post", match: (o) => o.paymentMethod === "post" && o.status === "pending" },
  { id: "online", match: (o) => o.paymentMethod === "online" && o.status !== "refused" },
  { id: "refused", match: (o) => o.status === "refused" },
];

export default function DashboardOrders() {
  const { t, lang } = useLang();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const status = useAppSelector((state) => state.orders.status);
  const loading = (status === "idle" || status === "loading") && orders.length === 0;
  const failed = status === "failed" && orders.length === 0;
  const [tab, setTab] = useState("unpaid");
  const [receiptModal, setReceiptModal] = useState(null);
  const [busyId, setBusyId] = useState(null);

  function load() {
    dispatch(fetchOrders());
  }

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // the order is updated in the store when the API call succeeds
  async function handleStatus(id, newStatus, confirmText) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(id);
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
    } catch {
      window.alert(t.common.error);
    } finally {
      setBusyId(null);
    }
  }

  const tabLabels = {
    unpaid: t.dashboard.ordersUnpaid,
    post: t.dashboard.ordersPost,
    online: t.dashboard.ordersOnline,
    refused: t.dashboard.ordersRefused,
  };

  const sorted = useMemo(() => [...orders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [orders]);
  const filtered = sorted.filter(TABS.find((tb) => tb.id === tab).match);

  return (
    <div>
      <h1 className="font-serif font-bold text-2xl md:text-3xl text-blush-900 mb-4 md:mb-6">{t.dashboard.orders}</h1>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`shrink-0 h-11 px-4 rounded-full text-sm font-medium border transition ${
              tab === tb.id ? "bg-blush-700 text-white border-blush-700" : "bg-white text-stone-600 border-blush-200"
            }`}
          >
            {tabLabels[tb.id]} ({orders.filter(tb.match).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl shimmer" />
          ))}
        </div>
      ) : failed ? (
        <ErrorMessage onRetry={load} />
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center text-stone-400 bg-white rounded-2xl ring-1 ring-blush-100">{t.dashboard.noOrders}</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => {
            const busy = busyId === o.id;
            const customer = o.customer || {};
            return (
              <div key={o.id} className="p-4 md:p-5 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-serif font-bold text-lg text-blush-900" dir="ltr">
                      {o.orderNumber}
                    </p>
                    <p className="text-xs text-stone-400">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString(lang === "ar" ? "ar-DZ" : "fr-FR") : ""}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_BADGE[o.status] || "bg-stone-100 text-stone-500"}`}>
                    {t.common[o.status] || o.status}
                  </span>
                </div>

                {/* customer + totals */}
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1 text-stone-600">
                    <p className="font-medium text-stone-800">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <HiOutlinePhone size={14} className="text-blush-500" />
                      <a href={`tel:${customer.phone}`} dir="ltr" className="text-blush-700 font-medium">
                        {customer.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <HiOutlineMapPin size={14} className="text-blush-500" /> {customer.commune}, {customer.wilaya}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <HiOutlineTruck size={14} className="text-blush-500" /> {o.deliveryCompany} —{" "}
                      {customer.deliveryType === "home" ? t.checkout.home : t.checkout.stopDesk}
                    </p>
                  </div>
                  <div className="space-y-1 text-stone-600">
                    <p>
                      {t.checkout.productsTotal}: <strong>{formatPrice(o.productsTotal)} {t.common.dzd}</strong>
                    </p>
                    <p>
                      {t.checkout.deliveryPrice}: <strong>{formatPrice(o.deliveryPrice)} {t.common.dzd}</strong>
                    </p>
                    <p>
                      {t.checkout.totalDue}: <strong className="text-blush-700">{formatPrice(o.totalDue)} {t.common.dzd}</strong>
                    </p>
                    <p>
                      {t.checkout.depositTitle}:{" "}
                      {o.deposit ? (
                        <strong className="text-gold-600">
                          {formatPrice(o.deposit)} {t.common.dzd}
                          {o.paymentMethod === "online" ? ` • ${t.dashboard.viaOnline}` : o.paymentMethod === "post" ? ` • ${t.dashboard.viaPost}` : ""}
                        </strong>
                      ) : (
                        <strong className="text-rose-600">{t.dashboard.depositNotPaid}</strong>
                      )}
                    </p>
                  </div>
                </div>

                {/* ordered dresses, with the measurements written by the customer */}
                <div className="mt-3 space-y-2">
                  {(o.items || []).map((it, i) => (
                    <div key={`${it.key || it.productId}-${i}`} className="flex gap-3 p-2.5 rounded-xl bg-blush-50/70">
                      {it.image && <img src={it.image} alt="" className="h-16 w-12 rounded-lg object-cover object-top shrink-0 bg-white" />}
                      <div className="min-w-0 text-sm">
                        <p className="font-medium text-stone-800 line-clamp-1">{it.name?.[lang] || it.name?.fr}</p>
                        <p className="text-xs text-stone-500">
                          {t.cart.size}: <strong>{it.size || "—"}</strong> • {t.cart.color}: <strong>{it.color || "—"}</strong> • x{it.quantity}
                        </p>
                        {it.bodyNote && (
                          <p className="text-xs text-blush-800 mt-1 bg-white rounded-lg px-2 py-1 ring-1 ring-blush-100 whitespace-pre-line">
                            <span className="font-semibold">{t.cart.bodyNote}:</span> {it.bodyNote}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {o.receiptImage && (
                    <button
                      onClick={() => setReceiptModal(o.receiptImage)}
                      className="flex items-center gap-1.5 h-11 px-4 rounded-full border border-blush-200 text-sm font-medium text-blush-700 active:bg-blush-50"
                    >
                      <HiOutlineEye size={17} /> {t.dashboard.viewReceipt}
                    </button>
                  )}
                  {(o.status === "unpaid" || o.status === "refused") && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="flex items-center gap-1.5 h-11 px-4 rounded-full bg-blush-700 text-white text-sm font-semibold active:bg-blush-800"
                    >
                      <HiOutlinePhone size={17} /> {t.dashboard.contactClient}
                    </a>
                  )}
                  {(o.status === "pending" || o.status === "unpaid") && (
                    <>
                      <button
                        disabled={busy}
                        onClick={() => handleStatus(o.id, "confirmed")}
                        className="flex items-center gap-1.5 h-11 px-4 rounded-full bg-emerald-600 text-white text-sm font-semibold active:bg-emerald-700 disabled:opacity-60"
                      >
                        <HiOutlineCheck size={17} /> {t.dashboard.confirmOrder}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleStatus(o.id, "refused", t.dashboard.refuseConfirm)}
                        className="flex items-center gap-1.5 h-11 px-4 rounded-full bg-rose-600 text-white text-sm font-semibold active:bg-rose-700 disabled:opacity-60"
                      >
                        <HiOutlineXMark size={17} /> {t.dashboard.rejectOrder}
                      </button>
                    </>
                  )}
                  {o.status === "refused" && (
                    <button
                      disabled={busy}
                      onClick={() => handleStatus(o.id, o.paymentMethod ? "pending" : "unpaid")}
                      className="flex items-center gap-1.5 h-11 px-4 rounded-full border border-blush-200 text-sm font-medium text-stone-600 active:bg-blush-50 disabled:opacity-60"
                    >
                      <HiOutlineArrowUturnLeft size={17} /> {t.dashboard.restoreOrder}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!receiptModal} onClose={() => setReceiptModal(null)} title={t.dashboard.viewReceipt}>
        {receiptModal && <img src={receiptModal} alt="receipt" className="w-full rounded-xl" />}
      </Modal>
    </div>
  );
}
