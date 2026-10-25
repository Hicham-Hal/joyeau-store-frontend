import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center", light = false }) {
  const alignClass = align === "left" ? "text-start items-start" : "text-center items-center";
  return (
    <Reveal className={`flex flex-col gap-2.5 mb-7 md:mb-12 ${alignClass}`}>
      {eyebrow && (
        <span
          className={`text-[11px] md:text-sm font-semibold tracking-[0.3em] uppercase ${
            light ? "text-gold-200" : "text-blush-500"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <AnimatedText
        as="h2"
        text={title}
        inView
        className={`font-serif text-[1.9rem] leading-tight md:text-5xl font-bold ${light ? "text-white" : "text-blush-900"}`}
      />
      <div className="h-1 w-16 md:w-20 rounded-full bg-gradient-to-r from-gold-400 via-blush-400 to-gold-400" />
      {subtitle && (
        <p className={`max-w-2xl text-sm md:text-base ${light ? "text-rose-50/80" : "text-stone-500"}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}
