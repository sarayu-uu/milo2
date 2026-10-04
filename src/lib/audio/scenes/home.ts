/** Homepage voice recordings. Replace files in public/audio/scenes/home/. */
export const HOME_RECORDINGS = [
  {
    "id": "vo-milo-hmm",
    "file": "hmm.mp3",
    "lines": [
      "Hmm…"
    ],
    "durationMs": 1803
  },
  {
    "id": "vo-milo-i-had-two",
    "file": "i-had-two.mp3",
    "lines": [
      "I had TWO."
    ],
    "durationMs": 1960
  },
  {
    "id": "vo-milo-tummy",
    "file": "my-tummy-is-in-the-way.mp3",
    "lines": [
      "My tummy is in the way."
    ],
    "durationMs": 2848
  },
  {
    "id": "vo-milo-two",
    "file": "two.mp3",
    "lines": [
      "TWO!"
    ],
    "durationMs": 993
  },
  {
    "id": "vo-milo-together",
    "file": "we-found-it-together.mp3",
    "lines": [
      "We found it. Together."
    ],
    "durationMs": 3788
  },
  {
    "id": "vo-milo-little-help",
    "file": "little-help.mp3",
    "lines": [
      "Umm… little help?"
    ],
    "durationMs": 3083
  },
  {
    "id": "vo-milo-surprise",
    "file": "that-wasnt-there-before.mp3",
    "lines": [
      "Hmm, that wasn't there before."
    ],
    "durationMs": 2926
  },
  {
    "id": "vo-home-two-socks-thank-you",
    "file": "two-socks-thank-you.mp3",
    "lines": [
      "TWO socks. Thank you!",
      "TWO socks! Thank you!"
    ],
    "durationMs": 2195
  },
  {
    "id": "vo-home-shes-always-sleeping",
    "file": "shes-always-sleeping.mp3",
    "lines": [
      "Shh. She's sleeping. She's ALWAYS sleeping."
    ],
    "durationMs": 6270
  },
  {
    "id": "vo-home-somebody-clothes-are-waving-at-me",
    "file": "somebody-clothes-are-waving-at-me.mp3",
    "lines": [
      "Somebody's clothes are waving at me."
    ],
    "durationMs": 2691
  },
  {
    "id": "vo-home-sleepy-robot-water-tank",
    "file": "sleepy-robot-water-tank.mp3",
    "lines": [
      "That water tank looks like a sleepy robot."
    ],
    "durationMs": 3396
  },
  {
    "id": "vo-home-dramatic-curtain",
    "file": "dramatic-curtain.mp3",
    "lines": [
      "Whoosh. Very dramatic curtain."
    ],
    "durationMs": 3240
  },
  {
    "id": "vo-home-my-favourite-leaf",
    "file": "my-favourite-leaf.mp3",
    "lines": [
      "That leaf is my favourite leaf."
    ],
    "durationMs": 3396
  },
  {
    "id": "vo-home-crooked-its-fine",
    "file": "crooked-its-fine.mp3",
    "lines": [
      "One of these is crooked. It's fine."
    ],
    "durationMs": 4128
  },
  {
    "id": "vo-home-someone-drew-me",
    "file": "someone-drew-me.mp3",
    "lines": [
      "Someone drew me! …Is that me?"
    ],
    "durationMs": 3475
  },
  {
    "id": "vo-home-it-grows-down",
    "file": "it-grows-down.mp3",
    "lines": [
      "It grows DOWN. Is that allowed?"
    ],
    "durationMs": 3396
  },
  {
    "id": "vo-home-big-leaves",
    "file": "big-leaves.mp3",
    "lines": [
      "Leaves! Big ones."
    ],
    "durationMs": 2273
  },
  {
    "id": "vo-home-so-many-books",
    "file": "so-many-books.mp3",
    "lines": [
      "So many books. I've read… one."
    ],
    "durationMs": 5643
  },
  {
    "id": "vo-home-a-story-in-here",
    "file": "a-story-in-here.mp3",
    "lines": [
      "Old Cat says there's a story in here."
    ],
    "durationMs": 3161
  },
  {
    "id": "vo-home-taller-than-me",
    "file": "taller-than-me.mp3",
    "lines": [
      "It's taller than me. Most things are."
    ],
    "durationMs": 4363
  },
  {
    "id": "vo-home-squishy",
    "file": "squishy.mp3",
    "lines": [
      "Squishy!"
    ],
    "durationMs": 1568
  },
  {
    "id": "vo-home-old-cat-reads-upside-down",
    "file": "old-cat-reads-upside-down.mp3",
    "lines": [
      "Old Cat reads these. Upside down."
    ],
    "durationMs": 3318
  },
  {
    "id": "vo-home-i-can-stack-two",
    "file": "i-can-stack-two.mp3",
    "lines": [
      "A block! I can stack two. Sometimes three."
    ],
    "durationMs": 4755
  },
  {
    "id": "vo-home-we-could-draw-something",
    "file": "we-could-draw-something.mp3",
    "lines": [
      "A pencil! We could draw something."
    ],
    "durationMs": 2848
  },
  {
    "id": "vo-home-roll-come-back",
    "file": "roll-come-back.mp3",
    "lines": [
      "Roll! …Come back!"
    ],
    "durationMs": 1307
  },
  {
    "id": "vo-home-vroom-faster-than-me",
    "file": "vroom-faster-than-me.mp3",
    "lines": [
      "Vroom. It's faster than me."
    ],
    "durationMs": 3475
  },
  {
    "id": "vo-home-a-sunny-drawing",
    "file": "a-sunny-drawing.mp3",
    "lines": [
      "A sunny drawing. It makes the room warmer. I think."
    ],
    "durationMs": 5643
  },
  {
    "id": "vo-home-comfy-old-cat-agrees",
    "file": "comfy-old-cat-agrees.mp3",
    "lines": [
      "Comfy. Old Cat agrees."
    ],
    "durationMs": 3475
  }
] as const;

export type HomeRecordingId = (typeof HOME_RECORDINGS)[number]["id"];
