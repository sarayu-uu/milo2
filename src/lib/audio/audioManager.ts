import type { AudioBus, SoundId } from "@/types/audio";
import { useSettingsStore } from "@/stores/settingsStore";
import { sound } from "./soundManager";

export { SOUNDS } from "./sounds";

/** Share the existing Howler cache, mute state and mixer with all current scenes. */
export function playSound(id: SoundId, volume = 0.7) {
  return sound.play(id, { volume });
}

export function setGlobalVolume(volume: number) {
  useSettingsStore.getState().setAudio({ masterVolume: clamp(volume) });
}

export function muteAll() { useSettingsStore.getState().setAudio({ muted: true }); }
export function unmuteAll() { useSettingsStore.getState().setAudio({ muted: false }); }

export function setCategoryVolume(category: AudioBus, volume: number) {
  const key = { voice: "voiceVolume", sfx: "effectsVolume", ambience: "ambientVolume", activity: "activityVolume" } as const;
  useSettingsStore.getState().setAudio({ [key[category]]: clamp(volume) });
}

export function setCategoryEnabled(category: AudioBus, enabled: boolean) {
  const key = { voice: "voice", sfx: "effects", ambience: "ambient", activity: "activity" } as const;
  useSettingsStore.getState().setAudio({ [key[category]]: enabled });
}

export function initializeAudio() { return sound.initialize(); }
export function unlockAudio() { sound.unlock(); }

function clamp(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
