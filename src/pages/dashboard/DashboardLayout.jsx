import { useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlinePhoto,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineRectangleStack,
  HiOutlineTruck,
} from "react-icons/hi2";
import { useAuth, useStoreStatus } from "../../store/hooks";
import { useLang } from "../../context/LanguageContext";
import Logo from "../../components/Logo";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const { isOpen, toggleStore } = useStoreStatus();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/espace-vendeur" replace />;

  const links = [
    { to: "/espace-vendeur/tableau-de-bord", label: t.dashboard.overview, icon: HiOutlineSquares2X2 },
    { to: "/espace-vendeur/produits", label: t.dashboard.products, icon: HiOutlineShoppingBag },
    { to: "/espace-vendeur/collections", label: t.dashboard.categories, icon: HiOutlineRectangleStack },
    { to: "/espace-vendeur/galerie", label: t.dashboard.gallery, icon: HiOutlinePhoto },
    { to: "/espace-vendeur/commandes", label: t.dashboard.orders, icon: HiOutlineClipboardDocumentList },
    { to: "/espace-vendeur/livraison", label: t.dashboard.delivery, icon: HiOutlineTruck },
    { to: "/espace-vendeur/messages", label: t.dashboard.messages, icon: HiOutlineChatBubbleLeftRight },
  ];

  function handleLogout() {
    logout();
    navigate("/espace-vendeur");
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 lg:h-20 flex items-center px-5 border-b border-blush-100 shrink-0">
        <Logo />
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 min-h-[48px] rounded-xl text-sm font-medium transition ${
                isActive ? "bg-blush-700 text-white" : "text-stone-600 hover:bg-blush-50"
              }`
            }
          >
            <l.icon size={19} />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 pb-safe border-t border-blush-100 space-y-2 shrink-0">
        <button
          onClick={toggleStore}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold ${
            isOpen ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          <span>{isOpen ? t.dashboard.storeOpen : t.dashboard.storeClosedLabel}</span>
          <span className={`h-2.5 w-2.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 min-h-[48px] rounded-xl text-sm font-medium text-stone-500 active:bg-blush-50"
        >
          <HiOutlineArrowRightOnRectangle size={18} /> {t.dashboard.logout}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#fdf6f8]">
      <aside className="hidden lg:block w-72 shrink-0 bg-white border-e border-blush-100">{SidebarContent}</aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute top-0 bottom-0 start-0 w-[82%] max-w-72 bg-white shadow-2xl h-[100dvh]">{SidebarContent}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-blush-100 sticky top-0 z-30">
          <Logo compact />
          <button onClick={() => setSidebarOpen(true)} className="h-11 w-11 flex items-center justify-center rounded-full bg-blush-50 active:bg-blush-100" aria-label="Menu">
            <HiOutlineBars3 size={24} />
          </button>
        </div>
        <div className="p-4 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
