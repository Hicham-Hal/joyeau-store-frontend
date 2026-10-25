import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

// On phones the modal slides up from the bottom like a sheet (easy to reach with the thumb).
export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/55 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "tween", duration: 0.25 }}
            className={`bg-white shadow-2xl w-full ${maxWidth} rounded-t-3xl sm:rounded-2xl max-h-[92dvh] flex flex-col`}
          >
            <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3 shrink-0">
              <h3 className="font-serif text-xl text-blush-900">{title}</h3>
              <button
                onClick={onClose}
                className="h-10 w-10 -me-2 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 active:bg-blush-50"
                aria-label="Close"
              >
                <HiOutlineXMark size={22} />
              </button>
            </div>
            <div className="px-5 pb-6 pb-safe overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
