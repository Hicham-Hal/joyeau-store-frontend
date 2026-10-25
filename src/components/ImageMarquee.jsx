// Scrolling strip of small pictures (kept small so it loads fast on a phone).
export default function ImageMarquee({ images, height = "h-44 md:h-64" }) {
  const doubled = [...images, ...images];
  return (
    <div className="relative w-full overflow-hidden marquee-pause" dir="ltr">
      <div className="pointer-events-none absolute inset-y-0 start-0 w-10 md:w-32 bg-gradient-to-r from-[#fdf3f6] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-10 md:w-32 bg-gradient-to-l from-[#fdf3f6] to-transparent z-10" />
      <div className="flex gap-3 md:gap-4 w-max animate-marquee">
        {doubled.map((src, i) => (
          <div
            key={i}
            className={`relative ${height} w-28 md:w-48 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden shadow-md ring-1 ring-blush-100 bg-blush-50`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
