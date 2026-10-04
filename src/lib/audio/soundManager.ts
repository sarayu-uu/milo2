import type { Howl as HowlType } from "howler";
import type { AudioBus, SoundDefinition, SoundId } from "@/types/audio";
import type { SoundscapeId } from "@/types/activity";
import { SOUNDS, SOUNDSCAPES } from "./registry";
import { renderSound } from "./synth";

export interface MixState {
  muted: boolean;
  ambient: boolean;
  effects: boolean;
  ambientVolume: number;
  effectsVolume: number;
  voice?: boolean;
  voiceVolume?: number;
  activity?: boolean;
  activityVolume?: number;
  masterVolume?: number;
}

const clampVolume = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
const busFor = (def: SoundDefinition): AudioBus => def.bus ?? (
  def.category === "ambient" ? "ambience" : def.category === "character" ? "voice" : def.category === "environment" ? "activity" : "sfx"
);

/** One Howler cache and mixer shared by existing scenes and the named audio API. */
class SoundManager {
  private howler: typeof import("howler") | null = null;
  private library: Promise<typeof import("howler")> | null = null;
  private howls = new Map<SoundId, Promise<HowlType | null>>();
  private active = new Map<HowlType, Map<number, { id: SoundId; volume: number }>>();
  private mix: MixState = { muted: false, ambient: true, effects: true, ambientVolume: 0.35, effectsVolume: 0.8, voice: true, voiceVolume: 0.9, activity: true, activityVolume: 0.8, masterVolume: 1 };
  private ambientId: SoundId | null = null;
  private ambientHowl: HowlType | null = null;
  private wantedScape: SoundscapeId = "none";
  private sceneVersion = 0;
  private voiceSessions = new Set<symbol>();

  private lib() {
    if (!this.library) this.library = import("howler").then((lib) => {
      this.howler = lib;
      lib.Howler.autoUnlock = true;
      lib.Howler.mute(this.mix.muted);
      lib.Howler.volume(clampVolume(this.mix.masterVolume ?? 1));
      return lib;
    });
    return this.library;
  }

  /** Load Howler before the first tap so its mobile unlock handlers are ready. */
  async initialize() {
    if (typeof window === "undefined") return;
    try { await this.lib(); } catch { /* Audio remains optional. */ }
  }

  /** Called inside a user gesture, including keyboard activation. */
  unlock() {
    const ctx = this.howler?.Howler.ctx;
    if (ctx?.state === "suspended") void ctx.resume().catch(() => {});
  }

  private enabled(bus: AudioBus) {
    if (this.mix.muted) return false;
    if (bus === "ambience") return this.mix.ambient;
    if (bus === "voice") return this.mix.voice ?? true;
    if (bus === "activity") return this.mix.activity ?? true;
    return this.mix.effects;
  }

  private busVolume(bus: AudioBus) {
    const volume = bus === "ambience" ? this.mix.ambientVolume : bus === "voice" ? this.mix.voiceVolume ?? 0.9 : bus === "activity" ? this.mix.activityVolume ?? this.mix.effectsVolume : this.mix.effectsVolume;
    return clampVolume(volume) * (bus === "ambience" && this.voiceSessions.size ? 0.27 : 1);
  }

  private volume(id: SoundId, multiplier = 1) {
    const def = SOUNDS[id];
    const bus = busFor(def);
    return this.enabled(bus) ? clampVolume(def.volume * this.busVolume(bus) * multiplier) : 0;
  }

  private load(id: SoundId): Promise<HowlType | null> {
    const existing = this.howls.get(id);
    if (existing) return existing;
    const def = SOUNDS[id];
    const pending = (async () => {
      if (typeof window === "undefined") return null;
      try {
        const { Howl } = await this.lib();
        const src = def.src ?? [await renderSound(def.synth ?? id)];
        const howl = new Howl({ src, format: def.src ? undefined : ["wav"], loop: !!def.loop, volume: def.volume, preload: true });
        howl.on("playerror", (sid) => {
          // Howler's documented mobile recovery; don't replay a scene we left.
          howl.once("unlock", () => {
            if (!this.enabled(busFor(def))) return;
            if (def.loop && this.ambientHowl !== howl) return;
            if (!def.loop && !this.active.get(howl)?.has(sid)) return;
            howl.play(sid);
          });
        });
        return howl;
      } catch { return null; }
    })();
    this.howls.set(id, pending);
    return pending;
  }

  setMix(next: MixState) {
    const ambientChanged = next.ambient !== this.mix.ambient || next.muted !== this.mix.muted;
    this.mix = { ...this.mix, ...next };
    this.howler?.Howler.mute(this.mix.muted);
    this.howler?.Howler.volume(clampVolume(this.mix.masterVolume ?? 1));
    for (const [howl, instances] of this.active) {
      for (const [sid, entry] of instances) {
        if (!this.enabled(busFor(SOUNDS[entry.id]))) howl.stop(sid);
        else howl.volume(this.volume(entry.id, entry.volume), sid);
      }
    }
    if (ambientChanged) void this.setSoundscape(this.wantedScape, true);
    else this.fadeAmbience(0);
  }

  /** Duck while any dialogue/voice clip is active; release is idempotent. */
  beginVoice() {
    const token = Symbol("voice");
    this.voiceSessions.add(token);
    this.fadeAmbience(300);
    return () => {
      if (!this.voiceSessions.delete(token)) return;
      if (!this.voiceSessions.size) this.fadeAmbience(500);
    };
  }

  private fadeAmbience(duration: number) {
    if (this.ambientHowl && this.ambientId) {
      const target = this.volume(this.ambientId);
      if (duration) this.ambientHowl.fade(this.ambientHowl.volume() as number, target, duration);
      else this.ambientHowl.volume(target);
    }
    for (const [howl, instances] of this.active) {
      for (const [sid, entry] of instances) {
        if (busFor(SOUNDS[entry.id]) !== "ambience") continue;
        const target = this.volume(entry.id, entry.volume);
        if (duration) howl.fade(howl.volume(sid) as number, target, duration, sid);
        else howl.volume(target, sid);
      }
    }
  }

  async play(id: SoundId, opts: { rate?: number; volume?: number; signal?: AbortSignal; onStart?: () => void; onEnd?: () => void; onError?: () => void } = {}) {
    const def = SOUNDS[id];
    if (!def || !this.enabled(busFor(def)) || opts.signal?.aborted) return;
    const howl = await this.load(id);
    // Settings can change while the library or procedural WAV is loading.
    if (!this.enabled(busFor(def)) || opts.signal?.aborted) return;
    if (!howl) { opts.onError?.(); return; }
    const sid = howl.play();
    const volume = opts.volume ?? 1;
    howl.volume(this.volume(id, volume), sid);
    howl.rate(opts.rate ?? def.rate ?? 1, sid);
    let instances = this.active.get(howl);
    if (!instances) { instances = new Map(); this.active.set(howl, instances); }
    instances.set(sid, { id, volume });
    let release: (() => void) | undefined;
    const startVoice = () => { if (!release) release = this.beginVoice(); };
    if (busFor(def) === "voice") {
      howl.once("play", startVoice, sid);
    }
    // Fires when the sound is actually audible (after loading/unlock), not when requested.
    const started = () => opts.onStart?.();
    if (opts.onStart) howl.once("play", started, sid);
    const cleanup = () => {
      release?.();
      howl.off("play", startVoice, sid);
      howl.off("play", started, sid);
      howl.off("end", end, sid);
      howl.off("stop", cleanup, sid);
      howl.off("loaderror", failed);
      opts.signal?.removeEventListener("abort", abort);
      instances.delete(sid);
      if (!instances.size) this.active.delete(howl);
    };
    const end = () => { cleanup(); opts.onEnd?.(); };
    const failed = () => {
      cleanup();
      howl.stop(sid);
      if (!opts.signal?.aborted) opts.onError?.();
    };
    const abort = () => { howl.stop(sid); cleanup(); };
    howl.once("end", end, sid);
    howl.once("stop", cleanup, sid);
    howl.once("loaderror", failed);
    opts.signal?.addEventListener("abort", abort, { once: true });
  }

  preload(ids: SoundId[]) { ids.forEach((id) => void this.load(id)); }

  async setSoundscape(scape: SoundscapeId, force = false) {
    this.wantedScape = scape;
    const target = this.enabled("ambience") ? SOUNDSCAPES[scape] : null;
    if (!force && target === this.ambientId) return;
    const version = ++this.sceneVersion;
    const prev = this.ambientHowl;
    if (prev) {
      prev.fade(prev.volume() as number, 0, 900);
      setTimeout(() => {
        // A quick return can reuse this same cached Howl.
        if (this.ambientHowl !== prev) prev.stop();
      }, 950);
    }
    this.ambientHowl = null;
    this.ambientId = target;
    if (!target) return;
    const howl = await this.load(target);
    if (!howl || this.sceneVersion !== version || !this.enabled("ambience")) return;
    this.ambientHowl = howl;
    howl.volume(0);
    if (!howl.playing()) howl.play();
    howl.fade(0, this.volume(target), 1400);
  }
}

export const sound = new SoundManager();
