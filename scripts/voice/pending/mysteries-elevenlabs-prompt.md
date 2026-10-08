# Milo Mysteries: voices and sound effects (not generated yet)

Saved for later, so no ElevenLabs credits are spent while the activities are still changing.

**Before using it:** activity lines may have changed since this was written. Run `npm run voice:scan`
first and compare with `scripts/voice/todo.json`; if they differ, ask Claude for a fresh prompt.
Afterwards: put the files in Downloads and ask Claude to wire them (sound effects go to
`public/audio/sfx/`, voice lines are placed by `npm run voice:generate`).

Paste everything inside the box below into Claude in Chrome.

```
Part 1: Go to elevenlabs.io → Sound Effects. For each line, paste the description after
the "|", set the duration to about 1–2 seconds, generate, download as MP3, and save/rename
it to the exact file name before the "|". If one doesn't clearly sound like its
description, regenerate it before saving.

1. splash.mp3 | A small object dropping into a bowl of water, a light clear splash, no background noise
2. plop.mp3 | A small stone dropping into a bowl of water and sinking, a deep "plop", no background noise
3. magnet-click.mp3 | A metal object snapping onto a magnet, a sharp small metallic click, no background noise
4. thunk.mp3 | A wooden block pushed and stopping on a wooden floor, a soft dull thunk, no background noise
5. roll.mp3 | A small ball rolling across a wooden floor for one second, no background noise
6. squish.mp3 | A cloth pressed into a small puddle of water, a soft wet squish, no background noise
7. drip.mp3 | A single water drop falling onto a plate, a small clear drip, no background noise

Part 2: Go to Text to Speech. Select the voice "Ziggy" and the model "Eleven v3".
For each line, paste the text after the "|" exactly as written (including the [tag] at
the start where there is one), generate, download as MP3, and save/rename it to the exact
file name before the "|". Do every line; if one fails, retry it. At the end, list any
line you could not finish.

1. drag-one-into-the-water.mp3 | [excited] Drag one into the water!
2. hmm-what-happens-if-i-put.mp3 | [curious] Hmm… what happens if I put this in here?
3. its-staying-on-top.mp3 | [happy] It's staying on top!
4. lets-see-what-everything-did.mp3 | Let's see what everything did.
5. put-one-thing-in-the-water.mp3 | [curious] Put one thing in the water. What happens?
6. some-stayed-up-and-some-went.mp3 | [excited] Some stayed up… and some went down!
7. try-another-one.mp3 | [excited] Try another one!
8. want-to-try-it-with-real.mp3 | [curious] Want to try it with real water?
9. what-about-these.mp3 | [curious] What about these?
10. whered-it-go.mp3 | [curious] Where'd it go?
11. which-ones-stayed-up-which-went.mp3 | [curious] Which ones stayed up? Which went down?
12. a-cosy-cloth-coat-ooh.mp3 | A cosy cloth coat. Ooh.
13. a-paper-coat-crinkly.mp3 | A paper coat. Crinkly.
14. a-shiny-foil-coat-fancy.mp3 | A shiny foil coat. Fancy.
15. can-we-keep-kevin-cold.mp3 | [curious] Can we keep Kevin cold?
16. check-them-which-one-has-more.mp3 | [curious] Check them! Which one has more ice left?
17. do-you-think-it-will-keep.mp3 | [curious] Do you think it will keep him cold for longer?
18. four-kevins-four-different-coats-then.mp3 | Four Kevins. Four different coats. Then we wait.
19. good-scientists-arent-sure-either-lets.mp3 | [excited] Good. Scientists aren't sure either. Let's test!
20. hes-disappearing.mp3 | [surprised] He's disappearing.
21. hmm-look-again-which-one-is.mp3 | [curious] Hmm, look again. Which one is the biggest?
22. hmm-look-at-its-coat-again.mp3 | Hmm. Look at its coat again.
23. kevin-has-a-problem.mp3 | [thoughtful] Kevin has a problem.
24. kevin-we-should-probably-put-him.mp3 | Kevin! …We should probably put him back in the freezer.
25. lets-find-out.mp3 | [excited] Let's find out!
26. look-did-your-change-help.mp3 | [curious] Look! Did your change help?
27. no-coat-at-all-brave-kevin.mp3 | No coat at all. Brave, Kevin.
28. now-change-one-tap-a-kevin.mp3 | Now change one! Tap a Kevin to swap his coat. Then let time pass again.
29. that-one-look-how-much-is.mp3 | That one! Look how much is left.
30. the-cloth-it-kept-the-cold.mp3 | The cloth! It kept the cold in.
31. this-is-kevin.mp3 | [proudly] This is Kevin.
32. want-to-run-the-experiment-for.mp3 | [curious] Want to run the experiment for real?
33. what-should-we-wrap-kevin-in.mp3 | [curious] What should we wrap Kevin in?
34. what-was-around-it.mp3 | [curious] What was around it?
35. what-would-you-try-next.mp3 | [curious] What would you try next?
36. which-ice-will-last-longer-wrapped.mp3 | [curious] Which ice will last longer: wrapped or bare?
37. which-one-has-the-most-ice.mp3 | [curious] Which one has the most ice left?
38. do-that-again.mp3 | [suspicious] …Do that again.
39. find-something-that-sticks-and-something.mp3 | [excited] Find something that sticks, and something that doesn't!
40. guess-first-will-it-stick.mp3 | [curious] Guess first: will it stick?
41. hey.mp3 | [shouts] HEY!
42. i-thought-that-too.mp3 | [excited] I thought that too!
43. it-stuck.mp3 | [excited] It stuck!
44. lets-see-move-it-up-to.mp3 | Let's see! Move it up to the magnet.
45. lets-sort-them-which-ones-stuck.mp3 | [curious] Let's sort them! Which ones stuck?
46. nothing.mp3 | …Nothing.
47. nothing-rude.mp3 | …Nothing. Rude.
48. now-try-it.mp3 | [excited] Now try it!
49. these-stuck-these-didnt-mystery-solved.mp3 | [excited] These stuck. These didn't. Mystery solved!
50. want-to-test-things-with-a.mp3 | [curious] Want to test things with a real magnet?
51. will-it-stick.mp3 | [curious] Will it stick?
52. you-thought-so.mp3 | [excited] You thought so!
53. cold.mp3 | [shouts] COLD!
54. come-back-later-what-changed.mp3 | [curious] Come back later. What changed?
55. its-smaller.mp3 | [excited] It's smaller!
56. ooh-whats-this.mp3 | [curious] Ooh. What's this?
57. smaller-again.mp3 | Smaller AGAIN.
58. tiny-cold-rock.mp3 | [thoughtful] Tiny cold rock.
59. touch-it-or-drag-it-into.mp3 | Touch it! Or drag it into the sun.
60. touch-the-ice-is-it-cold.mp3 | [curious] Touch the ice. Is it cold?
61. want-to-watch-real-ice-melt.mp3 | [curious] Want to watch real ice melt?
62. water.mp3 | [curious] …Water?
63. where-did-my-ice-go.mp3 | [curious] Where did my ice go?
64. can-one-of-these-help.mp3 | [curious] Can one of these help?
65. drag-one-onto-the-puddle.mp3 | [excited] Drag one onto the puddle!
66. lets-see-what-each-one-did.mp3 | Let's see what each one did.
67. now-try-the-spoon.mp3 | [excited] Now try the spoon!
68. oh-it-went-all-floppy.mp3 | Oh. It went all floppy.
69. oops.mp3 | [confused] …Oops.
70. put-the-cloth-on-the-water.mp3 | [curious] Put the cloth on the water. What happens?
71. still-here.mp3 | …Still here.
72. the-cloth-drank-the-water-the.mp3 | The cloth drank the water! The paper drank a little.
73. the-water-went-in.mp3 | [excited] The water went IN!
74. want-to-make-a-tiny-puddle.mp3 | [curious] Want to make a tiny puddle?
75. which-one-drank-the-water.mp3 | [curious] Which one drank the water?
76. a-ball-go.mp3 | [happy] A ball! Go!
77. a-block-you-too.mp3 | [curious] A block. You too?
78. find-something-else-that-rolls.mp3 | [excited] Find something else that rolls!
79. i-roll.mp3 | I roll.
80. it-just-slid-a-bit.mp3 | It just slid a bit.
81. lets-race-the-ball-and-the.mp3 | [excited] Let's race the ball and the block! Push them!
82. no.mp3 | [suspicious] …No.
83. now-push-the-box.mp3 | [excited] Now push the box!
84. pick-one-then-give-it-a.mp3 | [excited] Pick one. Then give it a push!
85. push-the-ball-what-happens.mp3 | [curious] Push the ball. What happens?
86. the-ball-wins-it-just-keeps.mp3 | [excited] The ball wins! It just keeps going!
87. want-to-try-it-for-real.mp3 | [curious] Want to try it for real?
88. watch-me-i-can-roll-too.mp3 | [excited] Watch me. I can roll too. Give me a push!
89. wheee-all-the-way.mp3 | [excited] Wheee! All the way!
90. wobble-wobble-stop.mp3 | Wobble, wobble… stop.
91. can-you-find-something-that-surprises.mp3 | [curious] Can you find something that surprises you?
92. do-you-think-itll-stay-up.mp3 | [curious] Do you think it'll stay up… or go down?
93. hmm-which-ones-stayed-up-drag.mp3 | Hmm… which ones stayed up? Drag each one to where it belongs.
94. im-going-to-drop-this-stone.mp3 | [happy] I'm going to drop this stone in the water…
95. it-went-all-the-way-down.mp3 | [excited] It went all the way down!
96. lets-try-drag-it-into-the.mp3 | Let's try! Drag it into the water.
97. now-drop-it-in-what-happened.mp3 | [curious] Now drop it in. What happened?
98. pick-something-will-it-stay-up.mp3 | [curious] Pick something. Will it stay up or go down?
99. stayed-up-here-went-down-there.mp3 | [excited] Stayed up here. Went down there!
100. want-to-test-your-own-things.mp3 | [curious] Want to test your own things?
101. what-about-this-one-we-havent.mp3 | [excited] What about THIS one? We haven't tried it yet!
102. hmm-look-again-what-did-it.mp3 | [thoughtful] Hmm, look again! What did it do?
```
