import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineStar,
  HiOutlineSparkles,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useLang } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector, useCategories, useCategoryLabel } from "../../store/hooks";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../store/slices/productsSlice";
import { formatPrice } from "../../components/PriceTag";
import Modal from "../../components/Modal";
import ErrorMessage from "../../components/ErrorMessage";
import { MediaPicker, MediaListInput, MediaThumb } from "../../components/MediaInputs";

const emptyColor = () => ({ name: "", url: "", type: "image" });

const makeEmptyForm = (category = "") => ({
  category,
  nameFr: "",
  nameAr: "",
  price: "",
  prepDays: "",
  sizes: "36, 38, 40, 42, 44",
  colors: [emptyColor()],
  images: [],
  video: "",
  descriptionFr: "",
  descriptionAr: "",
  isBestSeller: false,
  isNew: false,
  stock: true,
});

export default function DashboardProducts() {
  const { t, lang } = useLang();
  const dispatch = useAppDispatch();
  const { categories } = useCategories();
  const getCategoryLabel = useCategoryLabel();
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);
  const loading = (status === "idle" || status === "loading") && products.length === 0;
  const failed = status === "failed" && products.length === 0;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    dispatch(fetchProducts({ force: true }));
  }

  useEffect(() => {
    dispatch(fetchProducts({ force: true }));
  }, [dispatch]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  function setColor(index, patch) {
    setForm((f) => ({ ...f, colors: f.colors.map((c, i) => (i === index ? { ...c, ...patch } : c)) }));
  }

  function openCreate() {
    setEditing(null);
    setForm(makeEmptyForm(categories[0]?.id || ""));
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setFormError("");
    setForm({
      category: p.category,
      nameFr: p.name.fr,
      nameAr: p.name.ar,
      price: p.price,
      prepDays: p.prepDays,
      sizes: p.sizes.join(", "),
      colors: p.colors.length ? p.colors.map((c) => ({ ...c })) : [emptyColor()],
      images: [...p.images],
      video: p.video || "",
      descriptionFr: p.description?.fr || "",
      descriptionAr: p.description?.ar || "",
      isBestSeller: p.isBestSeller,
      isNew: p.isNew,
      stock: p.stock,
    });
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm(t.dashboard.deleteConfirm)) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch {
      window.alert(t.common.error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const colors = form.colors
      .filter((c) => c.name.trim())
      .map((c) => ({ name: c.name.trim(), url: c.url || "", type: c.type === "video" ? "video" : "image" }));

    if (!form.category) {
      setFormError(t.dashboard.needCategory);
      return;
    }
    if (form.images.length === 0 && !colors.some((c) => c.url)) {
      setFormError(t.dashboard.needPhoto);
      return;
    }

    setSaving(true);
    setFormError("");
    const payload = {
      category: form.category,
      name: { fr: form.nameFr.trim(), ar: form.nameAr.trim() || form.nameFr.trim() },
      price: Number(form.price) || 0,
      prepDays: Number(form.prepDays) || 0,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors,
      images: form.images,
      video: form.video,
      description: { fr: form.descriptionFr, ar: form.descriptionAr || form.descriptionFr },
      isBestSeller: form.isBestSeller,
      isNew: form.isNew,
      stock: form.stock,
    };
    try {
      if (editing) {
        await dispatch(updateProduct({ id: editing.id, payload })).unwrap();
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      // the modal stays open so nothing typed is lost
      setFormError(err?.message === "storage_full" ? t.upload.storageFull : t.common.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-blush-900">{t.dashboard.manageProducts}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 h-12 px-5 rounded-full bg-blush-700 text-white text-sm font-semibold active:bg-blush-800 transition shrink-0"
        >
          <HiOutlinePlus size={19} /> <span className="hidden sm:inline">{t.dashboard.addProduct}</span>
          <span className="sm:hidden">{t.common.add}</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer" />
          ))}
        </div>
      ) : failed ? (
        <ErrorMessage onRetry={load} />
      ) : (
        <ul className="space-y-3">
          {products.map((p) => {
            const cover = p.images[0] || p.colors.find((c) => c.url && c.type === "image")?.url;
            return (
              <li key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white ring-1 ring-blush-100 shadow-sm">
                {cover ? (
                  <img src={cover} alt="" className="h-20 w-16 rounded-xl object-cover object-top shrink-0 bg-blush-50" />
                ) : (
                  <MediaThumb url="" className="h-20 w-16" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 line-clamp-1">{p.name[lang]}</p>
                  <p className="text-xs text-stone-400 line-clamp-1">{getCategoryLabel(p.category, lang)}</p>
                  <p className="text-blush-700 font-semibold text-sm mt-0.5">
                    {formatPrice(p.price)} {t.common.dzd}
                    <span className="text-xs font-normal text-stone-400"> • {p.prepDays}j</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                    {p.isBestSeller && <HiOutlineStar className="text-gold-500" title="Bestseller" />}
                    {p.isNew && <HiOutlineSparkles className="text-emerald-500" title="New" />}
                    <span>{p.colors.length} {t.dashboard.colorsCount}</span>
                    {!p.stock && <span className="text-rose-500">{t.common.outOfStock}</span>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="h-11 w-11 flex items-center justify-center rounded-full bg-blush-50 text-blush-600 active:bg-blush-100"
                    aria-label={t.common.edit}
                  >
                    <HiOutlinePencilSquare size={19} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="h-11 w-11 flex items-center justify-center rounded-full bg-rose-50 text-rose-500 active:bg-rose-100"
                    aria-label={t.common.delete}
                  >
                    <HiOutlineTrash size={19} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t.dashboard.editProduct : t.dashboard.addProduct}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Labeled label={`${t.dashboard.productName} (FR)`}>
              <input required value={form.nameFr} onChange={(e) => set("nameFr", e.target.value)} className="input-field" />
            </Labeled>
            <Labeled label={`${t.dashboard.productName} (AR)`}>
              <input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="input-field" dir="rtl" />
            </Labeled>
            <Labeled label={t.dashboard.category}>
              <select required value={form.category} onChange={(e) => set("category", e.target.value)} className="input-field">
                {!form.category && <option value="">—</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c[lang] || c.fr}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled label={t.dashboard.price}>
              <input required type="number" inputMode="numeric" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className="input-field" />
            </Labeled>
            <Labeled label={t.dashboard.prepDays}>
              <input type="number" inputMode="numeric" min="0" value={form.prepDays} onChange={(e) => set("prepDays", e.target.value)} className="input-field" />
            </Labeled>
            <Labeled label={t.dashboard.sizes}>
              <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className="input-field" />
            </Labeled>
          </div>

          {/* photos */}
          <div className="p-4 rounded-2xl bg-blush-50/60 border border-blush-100 space-y-4">
            <div>
              <p className="text-sm font-semibold text-stone-700">{t.dashboard.photos}</p>
              <p className="text-xs text-stone-400 mb-3">{t.dashboard.photosHint}</p>
              <MediaListInput value={form.images} onChange={(images) => set("images", images)} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">{t.dashboard.video}</p>
              <MediaPicker kind="video" value={form.video} onChange={(url) => set("video", url)} />
            </div>
          </div>

          {/* colors: name + the picture / video of the dress in this color */}
          <div className="p-4 rounded-2xl bg-gold-50/60 border border-gold-100 space-y-3">
            <div>
              <p className="text-sm font-semibold text-stone-700">{t.dashboard.colors}</p>
              <p className="text-xs text-stone-400">{t.dashboard.colorsHint}</p>
            </div>
            {form.colors.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-white ring-1 ring-gold-100 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    value={c.name}
                    onChange={(e) => setColor(i, { name: e.target.value })}
                    placeholder={t.dashboard.colorName}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set("colors", form.colors.length > 1 ? form.colors.filter((_, idx) => idx !== i) : [emptyColor()])
                    }
                    className="h-11 w-11 shrink-0 flex items-center justify-center rounded-full bg-rose-50 text-rose-500 active:bg-rose-100"
                    aria-label={t.upload.remove}
                  >
                    <HiOutlineXMark size={20} />
                  </button>
                </div>
                <MediaPicker
                  kind="both"
                  value={c.url}
                  type={c.type}
                  onChange={(url, type) => setColor(i, { url, type: type || "image" })}
                  thumbClass="h-16 w-14"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("colors", [...form.colors, emptyColor()])}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-gold-400 text-gold-700 text-sm font-semibold active:bg-gold-50"
            >
              <HiOutlinePlus size={17} /> {t.dashboard.addColor}
            </button>
          </div>

          <Labeled label={`${t.dashboard.description} (FR)`}>
            <textarea rows={3} value={form.descriptionFr} onChange={(e) => set("descriptionFr", e.target.value)} className="input-field resize-none" />
          </Labeled>
          <Labeled label={`${t.dashboard.description} (AR)`}>
            <textarea rows={3} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className="input-field resize-none" dir="rtl" />
          </Labeled>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Toggle label={t.dashboard.isBestSeller} checked={form.isBestSeller} onChange={(v) => set("isBestSeller", v)} />
            <Toggle label={t.dashboard.isNew} checked={form.isNew} onChange={(v) => set("isNew", v)} />
            <Toggle label={t.dashboard.stock} checked={form.stock} onChange={(v) => set("stock", v)} />
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

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-stone-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl border border-blush-200 bg-white cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-blush-600" />
      <span className="text-sm text-stone-700">{label}</span>
    </label>
  );
}
