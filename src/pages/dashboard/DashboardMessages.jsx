import { useEffect } from "react";
import { HiOutlinePhone, HiOutlineTrash, HiOutlineEnvelopeOpen } from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMessages, markMessageRead, deleteMessage } from "../../store/slices/messagesSlice";
import ErrorMessage from "../../components/ErrorMessage";

export default function DashboardMessages() {
  const { t, lang } = useLang();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages.items);
  const status = useAppSelector((state) => state.messages.status);
  const loading = (status === "idle" || status === "loading") && messages.length === 0;
  const failed = status === "failed" && messages.length === 0;

  function load() {
    dispatch(fetchMessages());
  }

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  async function handleRead(id) {
    try {
      await dispatch(markMessageRead(id)).unwrap();
    } catch {
      window.alert(t.common.error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t.dashboard.deleteConfirm)) return;
    try {
      await dispatch(deleteMessage(id)).unwrap();
    } catch {
      window.alert(t.common.error);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-blush-900 mb-6">{t.dashboard.messages}</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl shimmer" />
          ))}
        </div>
      ) : failed ? (
        <ErrorMessage onRetry={load} />
      ) : messages.length === 0 ? (
        <div className="p-10 text-center text-stone-400 bg-white rounded-2xl ring-1 ring-blush-100">{t.dashboard.noMessages}</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl ring-1 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 justify-between ${
                m.read ? "bg-white ring-blush-100" : "bg-blush-50 ring-blush-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-stone-800">{m.name}</p>
                  {!m.read && <span className="h-2 w-2 rounded-full bg-blush-600" />}
                </div>
                <p className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                  <HiOutlinePhone size={13} /> {m.phone}
                </p>
                <p className="text-sm text-stone-600">{m.message}</p>
                <p className="text-[11px] text-stone-400 mt-2">
                  {new Date(m.createdAt).toLocaleString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!m.read && (
                  <button
                    onClick={() => handleRead(m.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-blush-200 text-xs font-medium text-blush-700 hover:bg-blush-100"
                  >
                    <HiOutlineEnvelopeOpen size={15} /> {t.dashboard.markRead}
                  </button>
                )}
                <a
                  href={`tel:${m.phone}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-blush-700 text-white text-xs font-medium hover:bg-blush-800"
                >
                  <HiOutlinePhone size={15} />
                </a>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-rose-200 text-xs font-medium text-rose-500 hover:bg-rose-50"
                >
                  <HiOutlineTrash size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
