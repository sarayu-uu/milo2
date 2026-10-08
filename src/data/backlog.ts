/**
 * Activities planned but NOT built yet (held back). Shown only on the hidden
 * /activity page, for the team. When one gets built, move it out of here.
 */
export interface BacklogActivity {
  name: string;
  description: string;
  focus: string;
  /** 3, 4 or 5 (the youngest age it's meant for). */
  age: 3 | 4 | 5;
  /** The Play Book colour it would go in. */
  strip: "Explore" | "Think" | "Numbers" | "Stories & Words" | "Make" | "Draw" | "Move" | "Little Helpers";
}

export const BACKLOG: BacklogActivity[] = [
  /* ---------- age 3 ---------- */
  { age: 3, strip: "Think", name: "Milo's Colour Laundry", description: "Laundry is blowing in the wind. Drag each shirt into the basket of the same colour, then find something red in your room.", focus: "Basic colour matching" },
  { age: 3, strip: "Stories & Words", name: "Milo's Face", description: "Milo loses his sock. How does he feel? Pick between two faces, then watch his face change when the problem is solved.", focus: "Recognising basic emotions (happy, sad, angry, scared)" },
  { age: 3, strip: "Little Helpers", name: "Where Did My Sock Go?", description: "Milo holds one yellow sock. Find its partner peeking out from the sofa and drag the two together. Later rounds offer two socks to choose from.", focus: "Observation, same and different, matching" },
  { age: 3, strip: "Explore", name: "Milo's Windy Window", description: "Something is moving the curtain. Slide the wind from gentle to strong and watch the curtain, the leaves and Milo's feathers move more.", focus: "Air and movement, cause and effect" },
  { age: 3, strip: "Explore", name: "Wake Up, Flower!", description: "A flower is drooping. Try water, sunshine or a toy and see what helps it stand up again.", focus: "What plants need" },
  { age: 3, strip: "Explore", name: "Where Is That Sound?", description: "A sound plays from the left or the right. Milo looks the wrong way; tap the side the sound came from. Later the pictures disappear.", focus: "Sound and direction, listening attention" },
  { age: 3, strip: "Explore", name: "Which Way Will It Fall?", description: "Tip blocks, a ball and a cup off the edge and watch which way they fall.", focus: "Gravity, cause and effect" },

  /* ---------- age 4 ---------- */
  { age: 4, strip: "Draw", name: "Finish Milo's House", description: "Milo drew a square. Add two slanting lines for the roof, then a door and a window, and colour one part.", focus: "Lines to shapes to a real object (drawing with purpose)" },
  { age: 4, strip: "Think", name: "Milo's Pattern Laundry", description: "Socks on a line: yellow, blue, yellow, blue… what comes next? Then red-red-blue patterns, then make your own.", focus: "AB and AAB patterns" },
  { age: 4, strip: "Draw", name: "The Three-Step Drawing", description: "Draw a flower in three steps: a standing line, a circle on top, two curved leaves. Then a sun, a house, a fish, a tree or a balloon.", focus: "Representational drawing from simple shapes" },
  { age: 4, strip: "Think", name: "Who Comes First?", description: "Milo washes his hands. The pictures get shuffled: soap, water, rubbing, drying. Put them back in order, then do daily routines.", focus: "Sequencing" },
  { age: 4, strip: "Think", name: "Sort Squirrel's Collection", description: "Squirrel tipped out leaves, buttons, balls and blocks. Sort them by colour, then by shape, then by size.", focus: "Classification (the same things sorted different ways)" },
  { age: 4, strip: "Numbers", name: "How Many Does Milo Need?", description: "Three friends come for snacks. Give each one a plate, count the plates, add one fruit per plate. Does everyone have one?", focus: "Counting 1–5 through a real problem" },
  { age: 4, strip: "Think", name: "What Happens Next?", description: "Milo stacks blocks badly. One more? Predict: it falls, flies or disappears, then watch. Also dark clouds, ice in the sun, a pushed ball.", focus: "Prediction" },
  { age: 4, strip: "Stories & Words", name: "Emotion Detective", description: "Dog's ball rolls away. How might Dog feel? What could Milo do: help find it, take a toy, or ignore him?", focus: "Empathy and social problem solving" },
  { age: 4, strip: "Explore", name: "Milo's Growing Sponge", description: "Dip a sponge, a cloth and a stone in water. Which one gets bigger and heavier?", focus: "Absorption, comparison" },
  { age: 4, strip: "Explore", name: "The Rolling Race", description: "Two ramps, one flat and one steep. Guess which ball wins, race them, then change a ramp's height and race again.", focus: "Slopes and movement, changing one thing" },
  { age: 4, strip: "Explore", name: "Where Does the Water Go?", description: "Pour the same cup of water into a tall glass and a wide bowl. It looks different. Did we lose some? Pour it back to check.", focus: "Containers and volume (early conservation)" },
  { age: 4, strip: "Think", name: "Which Melts First?", description: "Ice, chocolate and butter in the sun. Guess which melts first, then watch.", focus: "Temperature and change" },
  { age: 4, strip: "Explore", name: "Plant Detective", description: "Milo's plant was upright yesterday; today it droops. Pick what it needs: water, a toy or a book. It perks up later in Milo's World.", focus: "Observation, living things' needs" },
  { age: 4, strip: "Explore", name: "Sound Through Things", description: "Tap a spoon on wood, metal and a cushion. Which sounds loud, which sounds soft?", focus: "Sound and materials" },
  { age: 4, strip: "Think", name: "The Mystery Smudge", description: "Muddy footprints across the floor. Compare them to everyone's feet, follow the trail behind the sofa… Dog.", focus: "Comparison, observation, inference" },

  /* ---------- age 5 ---------- */
  { age: 5, strip: "Draw", name: "Draw Milo's Missing Kite", description: "Draw a diamond from four slanting lines, add a curved string and bows, decorate it, and the kite flies into the story.", focus: "Drawing a recognisable object from shapes" },
  { age: 5, strip: "Stories & Words", name: "Fix the Story", description: "Milo tells yesterday's story in the wrong order (breakfast before waking up). Rearrange the pictures, then he retells it.", focus: "Sequencing and story understanding" },
  { age: 5, strip: "Make", name: "Build a Bridge for Milo", description: "Milo needs to cross a puddle. Try long blocks, short blocks and stones. Does it hold? What should we change?", focus: "Spatial reasoning, problem solving" },
  { age: 5, strip: "Think", name: "Mystery Object", description: "Something is in Squirrel's bag. Clues one at a time: it's round, it bounces, we play with it outside. Then reverse it: pick the clues for an object.", focus: "Describing words, inference" },
  { age: 5, strip: "Stories & Words", name: "Milo's Little Story Maker", description: "Choose a character, a place and a problem. Pick what happens at each turn, then watch your whole story played back.", focus: "Storytelling, imagination, language" },
  { age: 5, strip: "Explore", name: "Milo's Colour Lab", description: "Milo mixes yellow and blue by accident: green! Predict red + yellow, mix it, then make green again on purpose.", focus: "Colour mixing, prediction, repeating a result" },
  { age: 5, strip: "Make", name: "Build a Boat for Milo", description: "A ball of clay sinks. Flatten it into a boat and it floats. Add pebbles one by one… plop. Too many passengers.", focus: "Floating and design" },
  { age: 5, strip: "Make", name: "Which Bridge Works?", description: "Three bridge designs across a gap. Test each with toys and see which holds the most.", focus: "Structures, problem solving" },
  { age: 5, strip: "Explore", name: "Make the Shadow Bigger", description: "Move Milo closer to and further from the lamp. Predict how big his shadow will be, then check.", focus: "Light and distance" },
  { age: 5, strip: "Make", name: "Milo's Sound Telephone", description: "Two cups and a string. Loose string: Squirrel can't hear. Pull it tight: she can. My voice went through a string?!", focus: "Sound and vibration" },
  { age: 5, strip: "Explore", name: "Seed Detective", description: "Plant seeds with and without water and light, then watch them over several days.", focus: "Growth and living things" },
  { age: 5, strip: "Think", name: "Where Will the Water Go?", description: "Turn pipe pieces so water reaches Milo's plant. Press Pour. Wrong path? It spills somewhere funny (not the rug!).", focus: "Gravity and paths, problem solving" },
  { age: 5, strip: "Make", name: "Which Paper Flies?", description: "Drop a flat sheet, a crumpled ball and a paper plane. Which lands first or flies farthest? Change the shape and try again.", focus: "Air and design" },
  { age: 5, strip: "Make", name: "Build Milo a Shelter", description: "It starts raining. Build a roof from paper, cloth, leaves or blocks. Then the wind comes: does it still work?", focus: "Materials, design, problem solving" },
];
