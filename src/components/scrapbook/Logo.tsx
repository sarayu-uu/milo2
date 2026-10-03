/**
 * MILOMI wordmark: chunky rounded dark-olive letters, a little sun resting
 * just above the "o", and a leaf sprout in place of the last "i"'s dot.
 * Everything is centred and sized in em, so set the size with font-size.
 */
const OLIVE = "#3b4530";

export function Logo({ className = "", tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-center text-center leading-none ${className}`} aria-label="Milomi" role="img">
      <span aria-hidden className="relative inline-flex items-end font-[family-name:var(--font-display)] font-bold tracking-[-0.01em]" style={{ color: OLIVE }}>
        Mil
        <span className="relative inline-block">
          o
          {/* small sun resting just above the o */}
          <svg viewBox="0 0 40 30" className="absolute top-[0.02em] left-1/2 h-[0.34em] w-[0.46em] -translate-x-1/2 overflow-visible">
            <circle cx={20} cy={24} r={7} fill="#f2b23a" />
            <path d="M20 6 V12 M8 12 L12 16 M32 12 L28 16" stroke="#f2b23a" strokeWidth={4.5} strokeLinecap="round" />
          </svg>
        </span>
        m
        <span className="relative inline-block">
          ı
          {/* a sprout instead of the dot */}
          <svg viewBox="0 0 40 40" className="absolute top-[0.02em] left-1/2 h-[0.36em] w-[0.36em] -translate-x-[30%] overflow-visible">
            <path d="M16 40 C16 30 18 22 21 18" stroke="#5f8a3e" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M19 20 C9 20 3 12 5 4 C15 4 21 10 19 20 Z" fill="#6f9a48" />
            <path d="M21 18 C27 8 37 6 40 12 C36 22 27 24 21 18 Z" fill="#87b05a" />
          </svg>
        </span>
      </span>
      {tagline && (
        <span className="font-display mt-[0.16em] font-medium tracking-[0.01em] whitespace-nowrap text-[#5d5a52]" style={{ fontSize: "max(11.5px, 0.19em)" }}>
          Little moments. A brighter tomorrow.
        </span>
      )}
    </span>
  );
}
