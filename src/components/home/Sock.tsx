/** A big yellow spotty sock (cut paper, no outline). viewBox 0 0 80 130. */
export function YellowSock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 130" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <pattern id="sock-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#e8bb3e" />
          <circle cx="4" cy="5" r="2.6" fill="#f6dd8f" />
          <circle cx="12" cy="12" r="2.2" fill="#f6dd8f" />
        </pattern>
        <filter id="sock-ps" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#5a3c1e" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#sock-ps)">
        <path d="M16 20 H58 V78 C58 90 64 96 70 102 C80 112 74 128 58 126 L28 122 C12 120 8 106 14 94 C16 88 16 82 16 76 Z" fill="url(#sock-dots)" />
        {/* ribbed cuff */}
        <path d="M13 6 H61 L60 26 H14 Z" fill="#f2d272" />
        <path d="M22 8 V24 M30 8 V24 M38 8 V24 M46 8 V24 M54 8 V24" stroke="#e2b33f" strokeWidth="2" />
        {/* heel + toe patches */}
        <path d="M14 94 C10 106 16 120 30 122 L28 108 C22 106 18 100 14 94 Z" fill="#d79c2c" opacity="0.6" />
        <path d="M70 102 C80 112 74 128 58 126 L60 112 C64 110 68 106 70 102 Z" fill="#d79c2c" opacity="0.6" />
      </g>
    </svg>
  );
}
