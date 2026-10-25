import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePlayCircle } from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchGallery, addGalleryItem, deleteGalleryItem } from "../../store/slices/gallerySlice";
import Modal from "../../components/Modal";
import ErrorMessage from "../../components/ErrorMessage";
import { MediaPicker } from "../../components/MediaInputs";

const emptyForm = { url: "", type: "image", placement: "home" };

export default function DashboardGallery() {
  const { t } = useLang();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.gallery.items);
  const status = useAppSelector((state) => state.gallery.status);
  const loading = (status === "idle" || status === "loading") && items.length === 0;
  const failed = status === "failed" && items.length === 0;
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    dispatch(fetchGallery());
  }

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const placementLabel = {
    home: t.dashboard.placementHome,
    best: t.dashboard.placementBest,
    new: t.dashboard.placementNew,
    about: t.dashboard.placementAbout,
  };

  function openAdd() {
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm(t.dashboard.deleteConfirm)) return;
    try {
      await dispatch(deleteGalleryItem(id)).unwrap();
    } catch {
      window.alert(t.common.error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.url.trim()) {
      setFormError(t.dashboard.needFile);
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await dispatch(addGalleryItem(form)).unwrap();
      setModalOpen(false);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err?.message === "storage_full" ? t.upload.storageFull : t.common.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-blush-900">{t.dashboard.manageGallery}</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-12 px-5 rounded-full bg-blush-700 text-white text-sm font-semibold active:bg-blush-800 transition shrink-0"
        >
          <HiOutlinePlus size={19} /> <span className="hidden sm:inline">{t.dashboard.addMedia}</span>
          <span className="sm:hidden">{t.common.add}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl shimmer" />
          ))}
        </div>
      ) : failed ? (
        <ErrorMessage onRetry={load} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative rounded-xl overflow-hidden aspect-square ring-1 ring-blush-100 bg-blush-50">
              {item.type === "video" ? (
                <div className="h-full w-full bg-blush-900 flex items-center justify-center text-white">
                  <HiOutlinePlayCircle size={36} />
                </div>
              ) : (
                <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
              {/* always visible: there is no "hover" on a phone */}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 end-2 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-rose-600 shadow active:bg-white"
                aria-label={t.common.delete}
              >
                <HiOutlineTrash size={18} />
              </button>
              <span className="absolute bottom-1.5 start-1.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px]">
                {placementLabel[item.placement] || item.placement}
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.dashboard.addMedia}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">{t.dashboard.mediaUrl}</p>
            <MediaPicker
              kind="both"
              value={form.url}
              type={form.type}
              onChange={(url, type) => setForm((f) => ({ ...f, url, type: type || "image" }))}
              thumbClass="h-24 w-20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">{t.dashboard.mediaPlacement}</label>
            <select
              value={form.placement}
              onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value }))}
              className="input-field"
            >
              <option value="home">{t.dashboard.placementHome}</option>
              <option value="best">{t.dashboard.placementBest}</option>
              <option value="new">{t.dashboard.placementNew}</option>
              <option value="about">{t.dashboard.placementAbout}</option>
            </select>
          </div>
          {formError && (
            <p className="text-sm text-rose-600" role="alert">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn-shine w-full min-h-[52px] rounded-full bg-gradient-to-r from-blush-600 to-gold-500 text-white font-semibold disabled:opacity-60"
          >
            {saving ? t.common.loading : t.common.add}
          </button>
        </form>
      </Modal>
    </div>
  );
}
