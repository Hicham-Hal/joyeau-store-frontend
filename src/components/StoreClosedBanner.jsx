import { useStoreStatus } from "../store/hooks";
import { useLang } from "../context/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";

export default function StoreClosedBanner() {
  const { isOpen, loaded } = useStoreStatus();
  const { t } = useLang();

  return (
    <AnimatePresence>
      {loaded && !isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white text-center text-xs md:text-sm py-2 px-4 font-medium tracking-wide">
            {t.storeClosed.banner}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
