import { useLang } from "../context/LanguageContext";

// Shown when an API call fails. `onRetry` re-dispatches the failed thunk.
export default function ErrorMessage({ onRetry }) {
  const { t } = useLang();

  return (
    <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-blush-100" role="alert">
      <p className="mb-4 text-sm text-rose-600">{t.common.error}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-blush-300 px-5 py-2 text-sm font-medium text-blush-700 transition hover:bg-blush-50"
        >
          {t.common.retry}
        </button>
      )}
    </div>
  );
}
