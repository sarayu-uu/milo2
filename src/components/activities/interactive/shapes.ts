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

/*
 * Spoken lines. Built here (not inline) so the voice pipeline can list every
 * possible line and record it: see scripts/voice/dynamic.mts.
 */
export const FIT_LINES = ["That WOULD fit!", "That could fit too!", "That fits as well! Hmm!"];
/** nth = 0 for the first object that fits; older children get a nudge to find more. */
export const fitLine = (nth: number, older: boolean) => FIT_LINES[Math.min(nth, 2)] + (older && nth === 0 ? " Could anything else fit?" : "");
/** "is a book round?" but "is a ball a rectangle?" */
export const notThatShapeLine = (obj: string, shape: string) => {
  const word = SHAPE_WORD[shape];
  return `Hmm… is a ${obj} ${/^(rectangle|circle|cylinder)$/.test(word) ? `a ${word}` : word}?`;
};
export const sortedLine = (item: string) => `A ${item} is a ${SHAPE_WORD[BIN_FOR[item]]}!`;
export const wrongBinLine = (bin: string) => `Hmm. Is that a ${SHAPE_WORD[bin]}? Look at its edges.`;
