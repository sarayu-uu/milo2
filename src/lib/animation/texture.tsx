/**
 * Crayon / coloured-pencil paint for character SVGs.
 *
 * Each flat colour becomes an SVG <pattern> made of the colour plus a tiny
 * rasterised grain + streak tile. Patterns are rasterised once and move
 * with the shape (userSpaceOnUse), so animation stays cheap — no live
 * filters are re-run per frame.
 */
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0 0.16  0 0 0 0.55 -0.18'/></filter><rect width='90' height='90' filter='url(#g)'/></svg>`,
)}`;

const STREAK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.02 0.45' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.42'/></filter><rect width='90' height='90' filter='url(#s)'/></svg>`,
)}`;

export class CrayonPalette {
  private used = new Map<string, string>();
  constructor(
    private uid: string,
    /** soft = gentle painterly grain (default); bold = stronger crayon */
    private strength: "soft" | "bold" = "soft",
  ) {}

  /** Paint for a colour: `fill={paint("#4a4b8a")}`. */
  paint = (color: string) => {
    let id = this.used.get(color);
    if (!id) {
      id = `cr-${this.uid}-${this.used.size}`;
      this.used.set(color, id);
    }
    return `url(#${id})`;
  };

  /** Render AFTER all paint() calls in the same render (put it last in the SVG). */
  defs() {
    return (
      <defs>
        {[...this.used.entries()].map(([color, id]) => (
          <pattern key={id} id={id} patternUnits="userSpaceOnUse" width={90} height={90}>
            <rect width={90} height={90} fill={color} />
            <image href={GRAIN} width={90} height={90} opacity={this.strength === "soft" ? 0.3 : 0.55} />
            <image href={STREAK} width={90} height={90} opacity={this.strength === "soft" ? 0.22 : 0.35} />
          </pattern>
        ))}
      </defs>
    );
  }
}

/** Sketchy pencil outline colour shared by all characters. */
export const PENCIL = "#2b2a40";

/* ------------------------------------------------------------------ */
/* Shared crayon paints for world art (rooms, house, props).           */
/* Defined once in the document by <WorldCrayonDefs/>; any inline SVG  */
/* can use them via cx("#hex").                                        */
/* ------------------------------------------------------------------ */
export const WORLD_COLORS = [
  "#df917a", "#c9705c", "#e9b39a", // coral sofa family
  "#d8b45e", "#c49a3e", // mustard
  "#a9b89a", "#8fa37f", "#7e8f63", "#92b97e", // sage / moss / leaf
  "#8fa7ba", "#6f8ba2", "#9fc2d6", "#cfe2ea", "#b9cad6", // blues
  "#b46b56", "#9a5545", // brick
  "#b4a8cd", "#9a8cbd", // lavender
  "#edba92", "#d8a5aa", // peach / pink
  "#b98e5f", "#8d6a43", "#c99a6c", "#a97e55", // woods
  "#f3ead6", "#e8dcc2", "#fbf8f1", // papers / walls light
  "#d6ddc8", "#c8d1b8", // living-room wall
  "#5f6b7a", "#3f4656", // dark tank / shadow
  "#e7d3b3", "#cdbb9a", // house walls
  "#c9634f", "#a9503f", // roof tiles
] as const;

/**
 * World paint. Currently flat (neat sticker-book style). Flip CRAYON_WORLD
 * to true to bring back the crayon grain on rooms and props.
 */
const CRAYON_WORLD = false;
export function cx(color: string) {
  return CRAYON_WORLD && (WORLD_COLORS as readonly string[]).includes(color) ? `url(#wc-${color.slice(1)})` : color;
}

export function WorldCrayonDefs() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        {WORLD_COLORS.map((c) => (
          <pattern key={c} id={`wc-${c.slice(1)}`} patternUnits="userSpaceOnUse" width={90} height={90}>
            <rect width={90} height={90} fill={c} />
            <image href={GRAIN} width={90} height={90} opacity={0.4} />
            <image href={STREAK} width={90} height={90} opacity={0.3} />
          </pattern>
        ))}
      </defs>
    </svg>
  );
}
