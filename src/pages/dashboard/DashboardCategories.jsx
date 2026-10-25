import { useEffect, useMemo, useState } from "react";
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineSparkles } from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../store/slices/categoriesSlice";
import { fetchProducts } from "../../store/slices/productsSlice";
import Modal from "../../components/Modal";
import ErrorMessage from "../../components/ErrorMessage";
import { MediaPicker } from "../../components/MediaInputs";

const emptyForm = { fr: "", ar: "", image: "" };

// "Collections" = the types of dresses shown on the site (Robes de mariée, Caftans...).
// The seller can add a new type, rename it, change its picture or delete it.
export default function DashboardCategories() {
  const { t, lang } = useLang();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const status = useAppSelector((state) => state.categories.status);
  const products = useAppSelector((state) => state.products.items);
  const loading = (status === "idle" || status === "loading") && categories.length === 0;
  const failed = status === "failed" && categories.length === 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    dispatch(fetchCategories());
  }

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts()); // to count the dresses of each collection
  }, [dispatch]);

  const counts = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({ fr: cat.fr, ar: cat.ar, image: cat.image || "" });
    setFormError("");
    setModalOpen(true);
  }

  async function handleDelete(cat) {
    const count = counts[cat.id] || 0;
    if (count > 0) {
      window.alert(`${t.dashboard.categoryInUse} (${count})`);
      return;
    }
    if (!window.confirm(t.dashboard.deleteConfirm)) return;
    try {
      await dispatch(deleteCategory(cat.id)).unwrap();
    } catch (err) {
      window.alert(err?.message === "category_in_use" || err?.status === 409 ? t.dashboard.categoryInUse : t.common.error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fr.trim()) return;
    setSaving(true);
    setFormError("");
    const payload = { fr: form.fr.trim(), ar: form.ar.trim() || form.fr.trim(), image: form.image };
    try {
      if (editing) {
        await dispatch(updateCategory({ id: editing.id, payload })).unwrap();
      } else {
        await dispatch(createCategory(payload)).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err?.message === "storage_full" ? t.upload.storageFull : t.common.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-blush-900">{t.dashboard.manageCategories}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 h-12 px-5 rounded-full bg-blush-700 text-white text-sm font-semibold active:bg-blush-800 transition shrink-0"
        >
          <HiOutlinePlus size={19} /> <span className="hidden sm:inline">{t.dashboard.addCategory}</span>
          <span className="sm:hidden">{t.common.add}</span>
        </button>
      </div>
      <p className="text-sm text-stone-500 mb-5">{t.dashboard.categoriesHint}</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer" />
          ))}
        </div>
      ) : failed ? (
        <ErrorMessage onRetry={load} />
      ) : categories.length === 0 ? (
        <div className="p-10 text-center text-stone-400 bg-white rounded-2xl ring-1 ring-blush-100">{t.dashboard.noCategories}</div>
      ) : (
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
              {cat.image ? (
                <img src={cat.image} alt="" className="h-20 w-16 rounded-xl object-cover object-top shrink-0 bg-blush-50" />
              ) : (
                <div className="h-20 w-16 rounded-xl shrink-0 bg-gradient-to-br from-blush-100 to-gold-100 flex items-center justify-center text-blush-300">
                  <HiOutlineSparkles size={26} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 line-clamp-1">{cat[lang] || cat.fr}</p>
                <p className="text-xs text-stone-400 line-clamp-1" dir={lang === "ar" ? "ltr" : "rtl"}>
                  {lang === "ar" ? cat.fr : cat.ar}
                </p>
                <p className="text-xs text-blush-600 mt-1">
                  {counts[cat.id] || 0} {t.dashboard.dressesCount}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 shrink-0">
                <button
                  onClick={() => openEdit(cat)}
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-blush-50 text-blush-600 active:bg-blush-100"
                  aria-label={t.common.edit}
                >
                  <HiOutlinePencilSquare size={19} />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-rose-50 text-rose-500 active:bg-rose-100"
                  aria-label={t.common.delete}
                >
                  <HiOutlineTrash size={19} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t.dashboard.editCategory : t.dashboard.addCategory}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-medium text-stone-500 mb-1.5">{t.dashboard.categoryNameFr}</span>
            <input required value={form.fr} onChange={(e) => setForm((f) => ({ ...f, fr: e.target.value }))} className="input-field" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-stone-500 mb-1.5">{t.dashboard.categoryNameAr}</span>
            <input value={form.ar} onChange={(e) => setForm((f) => ({ ...f, ar: e.target.value }))} className="input-field" dir="rtl" />
          </label>
          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">{t.dashboard.categoryImage}</p>
            <MediaPicker value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} thumbClass="h-24 w-20" />
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
            {saving ? t.common.loading : t.common.save}
          </button>
        </form>
      </Modal>
    </div>
  );
}
