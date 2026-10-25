import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineShoppingBag,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
  HiOutlinePhone,
} from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector, useStoreStatus } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productsSlice";
import { fetchOrders } from "../../store/slices/ordersSlice";
import { fetchMessages } from "../../store/slices/messagesSlice";
import { formatPrice } from "../../components/PriceTag";
import Modal from "../../components/Modal";
import Reveal from "../../components/Reveal";
import ErrorMessage from "../../components/ErrorMessage";
import { ORDER_STATUS_BADGE } from "./orderStatus";

export default function DashboardOverview() {
  const { t, lang } = useLang();
  const { isOpen, toggleStore } = useStoreStatus();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const orders = useAppSelector((state) => state.orders);
  const messages = useAppSelector((state) => state.messages);
  const [openList, setOpenList] = useState(null); // which order box is open: total | pending | confirmed | refused

  function loadAll() {
    dispatch(fetchProducts({ force: true }));
    dispatch(fetchOrders());
    dispatch(fetchMessages());
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const sections = [products, orders, messages];
  // Show the numbers once each list has loaded (stale numbers stay visible while refreshing).
  const ready = sections.every((s) => s.status === "succeeded" || s.items.length > 0);
  const failed = sections.some((s) => s.status === "failed");

  const lists = useMemo(() => {
    const newestFirst = [...orders.items].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return {
      total: newestFirst,
      pending: newestFirst.filter((o) => o.status === "pending"),
      confirmed: newestFirst.filter((o) => o.status === "confirmed"),
      refused: newestFirst.filter((o) => o.status === "refused"),
    };
  }, [orders.items]);

  const stats = useMemo(() => {
    if (!ready) return null;
    // revenue = deposits of the confirmed orders
    const revenue = lists.confirmed.reduce((sum, o) => sum + (o.deposit || 0), 0);
    return {
      products: products.items.length,
      unread: messages.items.filter((m) => !m.read).length,
      revenue,
    };
  }, [ready, lists.confirmed, products.items, messages.items]);

  const cards = stats
    ? [
        { id: "total", label: t.dashboard.totalOrders, value: lists.total.length, icon: HiOutlineClipboardDocumentList, color: "from-blush-500 to-blush-700" },
        { id: "pending", label: t.dashboard.pendingOrders, value: lists.pending.length, icon: HiOutlineClock, color: "from-gold-400 to-gold-600" },
        { id: "confirmed", label: t.dashboard.confirmedOrders, value: lists.confirmed.length, icon: HiOutlineCheckCircle, color: "from-emerald-400 to-emerald-600" },
        { id: "refused", label: t.dashboard.refusedOrders, value: lists.refused.length, icon: HiOutlineXCircle, color: "from-stone-400 to-stone-600" },
        { label: t.dashboard.totalProducts, value: stats.products, icon: HiOutlineShoppingBag, color: "from-indigo-400 to-indigo-600" },
        { label: t.dashboard.newMessages, value: stats.unread, icon: HiOutlineChatBubbleLeftRight, color: "from-sky-400 to-sky-600" },
        { label: t.dashboard.totalRevenue, value: `${formatPrice(stats.revenue)} ${t.common.dzd}`, icon: HiOutlineBanknotes, color: "from-rose-400 to-rose-600", wide: true },
      ]
    : [];

  const openCard = cards.find((c) => c.id === openList);
  const openOrders = openList ? lists[openList] : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-8">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-blush-900">{t.dashboard.overview}</h1>
        <button
          onClick={toggleStore}
          className={`flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-full text-sm font-semibold shadow ${
            isOpen ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-white/80" />
          {isOpen ? t.dashboard.storeOpen : t.dashboard.storeClosedLabel} — {t.dashboard.toggleStore}
        </button>
      </div>

      {failed && !ready && <ErrorMessage onRetry={loadAll} />}

      <p className="text-xs text-stone-400 mb-3">{t.dashboard.tapToSee}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {cards.map((c, i) => {
          const clickable = !!c.id;
          const Tag = clickable ? "button" : "div";
          return (
            <Reveal key={c.label} delay={i * 0.04} className={c.wide ? "col-span-2 lg:col-span-1" : ""}>
              <Tag
                {...(clickable ? { type: "button", onClick: () => setOpenList(c.id) } : {})}
                className={`w-full text-start p-3.5 md:p-5 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm flex items-center gap-3 md:gap-4 ${
                  clickable ? "active:scale-[0.98] md:hover:shadow-md md:hover:ring-blush-300 transition cursor-pointer" : ""
                }`}
              >
                <div className={`h-11 w-11 md:h-12 md:w-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shrink-0`}>
                  <c.icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] md:text-xs text-stone-400 leading-tight">{c.label}</p>
                  <p className="font-serif font-bold text-xl text-blush-900 truncate">{c.value ?? "—"}</p>
                </div>
              </Tag>
            </Reveal>
          );
        })}
      </div>

      {/* simple list of the orders of the box that was tapped */}
      <Modal
        open={!!openList}
        onClose={() => setOpenList(null)}
        title={openCard ? `${openCard.label} (${openOrders.length})` : ""}
        maxWidth="max-w-xl"
      >
        {openOrders.length === 0 ? (
          <p className="text-center text-stone-400 py-8">{t.dashboard.noOrders}</p>
        ) : (
          <ul className="divide-y divide-blush-100">
            {openOrders.map((o) => (
              <li key={o.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-blush-900 text-sm" dir="ltr">
                    {o.orderNumber}
                  </p>
                  <p className="text-sm text-stone-700 truncate">
                    {o.customer?.firstName} {o.customer?.lastName}
                  </p>
                  <a href={`tel:${o.customer?.phone}`} dir="ltr" className="inline-flex items-center gap-1 text-xs text-blush-700">
                    <HiOutlinePhone size={12} /> {o.customer?.phone}
                  </a>
                  <p className="text-[11px] text-stone-400">
                    {o.customer?.wilaya} • {o.createdAt ? new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR") : ""}
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-sm font-semibold text-blush-800">
                    {formatPrice(o.totalDue)} {t.common.dzd}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${ORDER_STATUS_BADGE[o.status] || "bg-stone-100 text-stone-500"}`}>
                    {t.common[o.status] || o.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/espace-vendeur/commandes"
          onClick={() => setOpenList(null)}
          className="mt-4 flex items-center justify-center h-12 rounded-full border border-blush-300 text-blush-700 text-sm font-medium active:bg-blush-50"
        >
          {t.dashboard.goToOrders}
        </Link>
      </Modal>
    </div>
  );
}
