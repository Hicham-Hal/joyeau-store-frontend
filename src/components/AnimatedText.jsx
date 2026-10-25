import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Text that appears word by word (rise + un-blur). It splits on WORDS, never on
// letters, so Arabic letters stay connected.
//
//   <AnimatedText as="h1" text="..." highlightLast={2} highlightClassName="font-script text-shine-gold" />
//
//  - inView: start when scrolled into view (for section titles) instead of on load
//  - highlightLast: the last N words get `highlightClassName`
//  - wordClassName: class applied to every word
const container = (stagger, delay) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const wordVariants = {
  hidden: { y: "105%", opacity: 0, filter: "blur(6px)" },
  show: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AnimatedText({
  text = "",
  as = "span",
  className = "",
  wordClassName = "",
  highlightLast = 0,
  highlightClassName = "",
  delay = 0,
  stagger = 0.09,
  inView = false,
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.span;
  const words = String(text).split(/\s+/).filter(Boolean);
  const firstHighlighted = words.length - highlightLast;
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, amount: 0.5 } }
    : { animate: "show" };

  return (
    <Tag
      className={className}
      variants={container(stagger, delay)}
      initial={reduceMotion ? "show" : "hidden"}
      {...trigger}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* overflow-hidden = the word slides up from behind a mask */}
          <span className="inline-block overflow-hidden align-top px-[0.06em] -mx-[0.06em] pb-[0.2em] -mb-[0.2em]">
            <motion.span
              variants={wordVariants}
              className={`inline-block ${wordClassName} ${
                highlightLast && i >= firstHighlighted ? highlightClassName : ""
              }`}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
