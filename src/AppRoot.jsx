import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { LanguageProvider } from "./context/LanguageContext";
import { store } from "./store";
import { useAppDispatch } from "./store/hooks";
import { fetchStoreStatus } from "./store/slices/shopSlice";
import { fetchCategories } from "./store/slices/categoriesSlice";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentStep from "./pages/PaymentStep";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import DashboardLogin from "./pages/dashboard/DashboardLogin";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import DashboardCategories from "./pages/dashboard/DashboardCategories";
import DashboardGallery from "./pages/dashboard/DashboardGallery";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardDelivery from "./pages/dashboard/DashboardDelivery";
import DashboardMessages from "./pages/dashboard/DashboardMessages";

// Loads the data every page needs once, when the app starts.
function Bootstrap({ children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStoreStatus());
    dispatch(fetchCategories()); // the collections (types of dresses) shown on the site
  }, [dispatch]);

  return children;
}

export default function AppRoot() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <Bootstrap>
          <HashRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/commande" element={<Checkout />} />
                <Route path="/commande/paiement/:orderNumber" element={<PaymentStep />} />
                <Route path="/commande/confirmation/:orderNumber" element={<OrderSuccess />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              <Route path="/espace-vendeur" element={<DashboardLogin />} />
              <Route path="/espace-vendeur" element={<DashboardLayout />}>
                <Route path="tableau-de-bord" element={<DashboardOverview />} />
                <Route path="produits" element={<DashboardProducts />} />
                <Route path="collections" element={<DashboardCategories />} />
                <Route path="galerie" element={<DashboardGallery />} />
                <Route path="commandes" element={<DashboardOrders />} />
                <Route path="livraison" element={<DashboardDelivery />} />
                <Route path="messages" element={<DashboardMessages />} />
              </Route>

              <Route path="*" element={<Layout />}>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </Bootstrap>
      </LanguageProvider>
    </Provider>
  );
}
