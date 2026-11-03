import { useEffect, useRef, useState } from "react";
import { HiOutlinePlus, HiOutlineChevronDown, HiOutlineCheck } from "react-icons/hi2";

// accent- and case-insensitive comparison ("Robes de Mariée" == "robes de mariee")
export const normalize = (s) =>
  String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

export default function CategoryCombobox({ value, onChange, categories, lang, placeholder, createLabel }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false); // filter only after the user types
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  const q = normalize(value);
  const labelOf = (c) => c[lang] || c.fr;
  const list =
    typed && q
      ? categories.filter((c) => normalize(c.fr).includes(q) || normalize(c.ar).includes(q))
      : categories;
  const exact = categories.some((c) => normalize(c.fr) === q || normalize(c.ar) === q);
  const showCreate = !!q && !exact;

  function pick(text) {
    onChange(text);
    setTyped(false);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <input
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setTyped(true);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="input-field pe-11"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setOpen((o) => !o)}
        className="absolute inset-y-0 end-0 w-11 flex items-center justify-center text-stone-400"
        aria-label="Toggle"
      >
        <HiOutlineChevronDown size={18} className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open && (list.length > 0 || showCreate) && (
        <ul className="absolute z-30 mt-1 w-full max-h-56 overflow-auto rounded-xl bg-white ring-1 ring-blush-200 shadow-lg py-1">
          {list.map((c) => {
            const active = normalize(labelOf(c)) === q;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => pick(labelOf(c))}
                  className="w-full flex items-center justify-between gap-2 px-4 min-h-[44px] text-start text-sm text-stone-700 active:bg-blush-50 hover:bg-blush-50"
                >
                  <span>{labelOf(c)}</span>
                  {active && <HiOutlineCheck className="text-blush-600" />}
                </button>
              </li>
            );
          })}
          {showCreate && (
            <li>
              <button
                type="button"
                onClick={() => pick(value.trim())}
                className="w-full flex items-center gap-2 px-4 min-h-[44px] text-start text-sm font-semibold text-gold-700 border-t border-blush-100 active:bg-gold-50 hover:bg-gold-50"
              >
                <HiOutlinePlus size={16} /> {createLabel} « {value.trim()} »
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}