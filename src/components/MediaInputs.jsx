import { useRef, useState } from "react";
import { HiOutlineArrowUpTray, HiOutlineXMark, HiOutlinePlayCircle, HiOutlinePlus } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";
import { uploadFile } from "../services/uploadService";

// Turns an upload error into a message the seller can understand.
function useUploadErrorText() {
  const { t } = useLang();
  return (err) => {
    if (err?.message === "video_too_large") return t.upload.videoTooLarge;
    if (err?.message === "storage_full") return t.upload.storageFull;
    return t.upload.failed;
  };
}

// Small picture / video preview (works for urls and for uploaded data)
export function MediaThumb({ url, type = "image", className = "h-16 w-14" }) {
  if (!url) {
    return <div className={`${className} rounded-lg bg-blush-50 border border-dashed border-blush-200 shrink-0`} />;
  }
  if (type === "video") {
    return (
      <div className={`${className} rounded-lg bg-blush-900 text-white flex items-center justify-center shrink-0 relative overflow-hidden`}>
        <video src={url} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <HiOutlinePlayCircle size={24} className="relative" />
      </div>
    );
  }
  return <img src={url} alt="" className={`${className} rounded-lg object-cover shrink-0 bg-blush-50`} />;
}

// ONE picture (or video): upload it from the phone / computer, or paste a URL.
//   value = url, type = "image" | "video", onChange(url, type)
//   kind  = what can be chosen: "image" (default) | "video" | "both"
const ACCEPT = { image: "image/*", video: "video/*", both: "image/*,video/*" };

export function MediaPicker({ value, type = "image", onChange, kind = "image", thumbClass = "h-20 w-16" }) {
  const { t } = useLang();
  const errorText = useUploadErrorText();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows choosing the same file again
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadFile(file);
      onChange(uploaded.url, uploaded.type);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-start gap-3">
      <MediaThumb url={value} type={kind === "video" ? "video" : type} className={thumbClass} />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-blush-700 text-white text-sm font-semibold active:bg-blush-800 disabled:opacity-60"
          >
            <HiOutlineArrowUpTray size={18} />
            {uploading ? t.upload.uploading : t.upload.choose}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("", kind === "video" ? "video" : "image")}
              className="inline-flex items-center gap-1 h-11 px-3 rounded-full border border-blush-200 text-sm text-stone-500 active:bg-blush-50"
            >
              <HiOutlineXMark size={16} /> {t.upload.remove}
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT[kind] || ACCEPT.image}
            className="hidden"
            onChange={handleFile}
          />
        </div>
        <input
          value={value && !value.startsWith("data:") ? value : ""}
          onChange={(e) => onChange(e.target.value, kind === "video" ? "video" : type)}
          placeholder={value?.startsWith("data:") ? t.upload.fileLoaded : t.upload.urlPlaceholder}
          className="input-field !min-h-10 !py-2 !text-sm"
          dir="ltr"
        />
        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
    </div>
  );
}

// SEVERAL pictures (the photos of a product). value = array of urls.
export function MediaListInput({ value = [], onChange }) {
  const { t } = useLang();
  const errorText = useUploadErrorText();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const added = [];
      for (const file of files) {
        const uploaded = await uploadFile(file); // one by one: keeps the phone responsive
        added.push(uploaded.url);
      }
      onChange([...value, ...added]);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    const clean = url.trim();
    if (!clean) return;
    onChange([...value, clean]);
    setUrl("");
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((src, i) => (
            <div key={`${i}-${src.slice(0, 40)}`} className="relative">
              <img src={src} alt="" className="h-20 w-16 rounded-lg object-cover bg-blush-50 ring-1 ring-blush-100" />
              {i === 0 && (
                <span className="absolute bottom-1 start-1 px-1.5 rounded bg-black/60 text-white text-[9px]">1</span>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -end-2 h-7 w-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow"
                aria-label={t.upload.remove}
              >
                <HiOutlineXMark size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-blush-700 text-white text-sm font-semibold active:bg-blush-800 disabled:opacity-60"
      >
        <HiOutlineArrowUpTray size={18} />
        {uploading ? t.upload.uploading : t.upload.chooseMany}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder={t.upload.urlPlaceholder}
          className="input-field !min-h-10 !py-2 !text-sm flex-1"
          dir="ltr"
        />
        <button
          type="button"
          onClick={addUrl}
          className="h-10 px-3 rounded-xl border border-blush-300 text-blush-700 text-sm font-medium inline-flex items-center gap-1 active:bg-blush-50"
        >
          <HiOutlinePlus size={16} /> {t.upload.addUrl}
        </button>
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
