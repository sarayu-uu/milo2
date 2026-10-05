/**
 * Reusable voice recordings shared by many activities (public/audio/scenes/common/). "Two" reuses the home TWO! clip.
 * If you replace a clip with one of a different length, update its durationMs.
 */
export const COMMON_RECORDINGS = [
  { id: "vo-common-something-changed", folder: "common", file: "something-changed.mp3", lines: ["Psst. I think something changed in my house…"], durationMs: 3631 },
  { id: "vo-common-that-was-fun", folder: "common", file: "that-was-fun.mp3", lines: ["That was fun. What now?"], durationMs: 2194 },
  { id: "vo-common-nice", folder: "common", file: "nice.mp3", lines: ["Nice!"], durationMs: 914 },
  { id: "vo-common-we-got-it", folder: "common", file: "we-got-it.mp3", lines: ["We got it!"], durationMs: 1306 },
  { id: "vo-common-yesss", folder: "common", file: "yesss.mp3", lines: ["Yesss!"], durationMs: 1306 },
  { id: "vo-common-happy-dance", folder: "common", file: "happy-dance.mp3", lines: ["Happy dance!"], durationMs: 1306 },
  { id: "vo-common-whoa", folder: "common", file: "whoa.mp3", lines: ["Whoa—!"], durationMs: 1149 },
  { id: "vo-common-air-five", folder: "common", file: "air-five.mp3", lines: ["Air five! That counts."], durationMs: 2273 },
  { id: "vo-common-yes-good-one", folder: "common", file: "yes-good-one.mp3", lines: ["Yes! Good one!"], durationMs: 1802 },
  { id: "vo-common-that-fits", folder: "common", file: "that-fits.mp3", lines: ["That fits!"], durationMs: 1306 },
  { id: "vo-common-not-sure-that-fits", folder: "common", file: "not-sure-that-fits.mp3", lines: ["Hmm, I'm not sure that one fits."], durationMs: 3396 },
  { id: "vo-common-already-counted", folder: "common", file: "already-counted.mp3", lines: ["We already counted that one!"], durationMs: 2038 },
  { id: "vo-common-how-many-are-there", folder: "common", file: "how-many-are-there.mp3", lines: ["So… how many are there?"], durationMs: 2429 },
  { id: "vo-common-count-again", folder: "common", file: "count-again.mp3", lines: ["Hmm. Let's count again, slowly."], durationMs: 3553 },
  { id: "vo-common-thats-it-remember", folder: "common", file: "thats-it-remember.mp3", lines: ["Yes! That's it. I remember now."], durationMs: 3161 },
  { id: "vo-common-thats-it-thank-you", folder: "common", file: "thats-it-thank-you.mp3", lines: ["That's it! Thank you."], durationMs: 1959 },
  { id: "vo-common-every-sock-has-a-friend", folder: "common", file: "every-sock-has-a-friend.mp3", lines: ["Every sock has a friend!"], durationMs: 2194 },
  { id: "vo-common-a-pair", folder: "common", file: "a-pair.mp3", lines: ["A pair!"], durationMs: 1071 },
  { id: "vo-common-together-again", folder: "common", file: "together-again.mp3", lines: ["Together again!"], durationMs: 1567 },
  { id: "vo-common-sock-friends", folder: "common", file: "sock-friends.mp3", lines: ["Sock friends!"], durationMs: 1411 },
  { id: "vo-common-look-at-the-colours", folder: "common", file: "look-at-the-colours.mp3", lines: ["Hmm, look at the colours… and the stripes."], durationMs: 4206 },
  { id: "vo-common-one", folder: "common", file: "one.mp3", lines: ["One"], durationMs: 836 },
  { id: "vo-common-three", folder: "common", file: "three.mp3", lines: ["Three"], durationMs: 836 },
  { id: "vo-common-four", folder: "common", file: "four.mp3", lines: ["Four"], durationMs: 758 },
  { id: "vo-common-five", folder: "common", file: "five.mp3", lines: ["Five"], durationMs: 993 },
  { id: "vo-common-six", folder: "common", file: "six.mp3", lines: ["Six"], durationMs: 993 },
  { id: "vo-common-seven", folder: "common", file: "seven.mp3", lines: ["Seven"], durationMs: 836 },
  { id: "vo-common-eight", folder: "common", file: "eight.mp3", lines: ["Eight"], durationMs: 914 },
  { id: "vo-common-nine", folder: "common", file: "nine.mp3", lines: ["Nine"], durationMs: 914 },
  { id: "vo-common-ten", folder: "common", file: "ten.mp3", lines: ["Ten"], durationMs: 758 },
] as const;

export type CommonRecordingId = (typeof COMMON_RECORDINGS)[number]["id"];
