import { HiOutlineCheck } from "react-icons/hi2";
import { useLang } from "../context/LanguageContext";

// Small progress bar: 1 = your information, 2 = confirmation deposit
export default function CheckoutSteps({ current = 1 }) {
  const { t } = useLang();
  const steps = [t.checkout.step1, t.checkout.step2];

  return (
    <ol className="flex items-center justify-center gap-2 mb-6 md:mb-8 text-xs md:text-sm">
      {steps.map((label, i) => {
        const number = i + 1;
        const done = number < current;
        const active = number === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`h-7 w-7 rounded-full flex items-center justify-center font-semibold shrink-0 ${
                done || active ? "bg-blush-700 text-white" : "bg-blush-100 text-blush-400"
              }`}
            >
              {done ? <HiOutlineCheck size={15} /> : number}
            </span>
            <span className={active ? "font-semibold text-blush-800" : "text-stone-400"}>{label}</span>
            {i < steps.length - 1 && <span className="w-6 sm:w-12 h-px bg-blush-200 mx-1" />}
          </li>
        );
      })}
    </ol>
  );
}
