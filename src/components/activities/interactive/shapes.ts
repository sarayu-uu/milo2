/**
 * Shape knowledge for the Mystery Bag. Deliberately generous: many objects
 * can fit one silhouette. That's the lesson — flexible reasoning.
 */
export const SILHOUETTE_FITS: Record<string, string[]> = {
  "shape-round": ["ball", "orange", "plate", "clock", "coin", "wheel", "button"],
  "shape-long": ["spoon", "pencil"],
  "shape-rect": ["book", "box", "phone", "door"],
  "shape-curved": ["banana", "moon"],
};

export const SHAPE_WORD: Record<string, string> = {
  "shape-round": "round",
  "shape-long": "long and thin",
  "shape-rect": "rectangle",
  "shape-curved": "curved",
  "shape-circle-outline": "circle",
  "shape-rect-outline": "rectangle",
  "shape-cylinder-outline": "cylinder",
};

export const BIN_FOR: Record<string, string> = {
  clock: "shape-circle-outline",
  plate: "shape-circle-outline",
  coin: "shape-circle-outline",
  wheel: "shape-circle-outline",
  book: "shape-rect-outline",
  phone: "shape-rect-outline",
  door: "shape-rect-outline",
  box: "shape-rect-outline",
  bottle: "shape-cylinder-outline",
  cup: "shape-cylinder-outline",
  jar: "shape-cylinder-outline",
};
