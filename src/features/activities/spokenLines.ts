/**
 * Lines put together while playing. Built here (not inline) so the voice
 * pipeline can list every possible line and record it: see
 * scripts/voice/dynamic.mts. Keep this file free of imports.
 */

/** Pattern game, after a wrong pick: read back the last three. */
export const sayTogetherLine = (sequence: string[]) => `Hmm. Let's say it together: ${sequence.slice(-3).join(", ")}…`;

/** Choice game's "hear the sound" button: the sound, twice. */
export const sayAloudLine = (sound: string) => `${sound}… ${sound}…`;
