import type { CharacterId } from "@/types/character";
import { CHARACTERS } from "@/data/characters";
import { sound } from "./soundManager";

/**
 * Character voice placeholder.
 *
 * Preschoolers mostly can't read, so lines are spoken. Until recorded
 * voice-over exists we use the browser's speech synthesis, preferring an
 * Indian-English voice. Swap `speak` for a VO-file lookup later
 * (e.g. /audio/vo/{activityId}/{beatId}.mp3) without changing callers.
 */
let enabled = true;
let cachedVoice: SpeechSynthesisVoice | null | undefined;
let voiceVolume = 0.9;
let masterVolume = 1;
let current: SpeechSynthesisUtterance | null = null;
let releaseAmbience: (() => void) | null = null;
let watchdog: ReturnType<typeof setTimeout> | null = null;

export function setVoiceVolume(volume: number, master = 1) {
  voiceVolume = Math.max(0, Math.min(1, volume));
  masterVolume = Math.max(0, Math.min(1, master));
  if (current) current.volume = voiceVolume * masterVolume;
}

function finishVoice() {
  if (watchdog) clearTimeout(watchdog);
  watchdog = null;
  releaseAmbience?.();
  releaseAmbience = null;
  current = null;
}

export function setVoiceEnabled(v: boolean) {
  enabled = v;
  if (!v) stopSpeaking();
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined && cachedVoice !== null) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  cachedVoice =
    voices.find((v) => v.lang === "en-IN") ??
    voices.find((v) => v.lang === "en-GB") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0];
  return cachedVoice;
}

/** Strip stage directions and emphasis so speech sounds natural. */
function speakable(text: string) {
  return text.replace(/\*/g, "").replace(/\(.*?\)/g, "").replace(/…/g, "...").trim();
}

export function speak(text: string, who: CharacterId | "narrator" = "milo") {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const line = speakable(text);
  if (!line) return;
  const synth = window.speechSynthesis;
  stopSpeaking();
  const u = new SpeechSynthesisUtterance(line);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  const settings = who === "narrator" ? { pitch: 1, rate: 0.92 } : CHARACTERS[who].voice;
  u.pitch = settings.pitch;
  u.rate = settings.rate;
  u.volume = voiceVolume * masterVolume;
  current = u;
  u.onstart = () => {
    if (current !== u || releaseAmbience) return;
    releaseAmbience = sound.beginVoice();
    // Some engines omit end/error events. Never leave the room permanently ducked.
    watchdog = setTimeout(() => { if (current === u) finishVoice(); }, Math.max(15000, line.length * 150 + 4000));
  };
  const finish = () => { if (current === u) finishVoice(); };
  u.onend = finish;
  u.onerror = finish;
  try { synth.speak(u); } catch { finish(); }
}

export function stopSpeaking() {
  finishVoice();
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
