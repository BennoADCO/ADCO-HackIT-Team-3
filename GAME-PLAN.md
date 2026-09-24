# 🧶 Grandma's Purradise — Game Plan

**Look and feel:** cosy village life-sim, in the visual language of Animal
Crossing — chequered lawn, sandy plaza, little shops with coloured roofs,
name tags, and big-head-small-body characters. All drawn by the game with
shapes and emoji; no artwork files, nothing to download.

## The pitch

You are a knitting grandma who runs a sanctuary for extremely fluffy cats.
Groom the cats for fluff, spin the fluff into yarn, knit the yarn into
scarves and mittens, sell them at market — then spend the money making the
cats happier, because **happy cats grow better fluff**. Five days later you
take your creations to the Fashion Show and find out if you are the
kingdom's Master Knitter.

## Controls

| Key | What it does |
|---|---|
| **Arrow keys** or **W A S D** | Walk Grandma around |
| **Space** | Use whatever you're standing next to (groom / spin / knit / sell) |
| **1 2 3 4** | Buy things — only works while standing at the Comfort Shop |
| **M** | Mute the music |
| **R** | Restart (on the results screen) |

## The core loop — the first 10 seconds

1. Grandma 👵 stands in the middle of the plaza. Four cats wander about.
2. A cat with a little ☁️ above its head is ready for grooming. Walk to it.
3. Press **Space**. Granny grooms it, the cat meows, you get fluff.
4. The bottom of the screen always tells you what to do next.

Then: fluff → 🎡 **Spinning Wheel** → yarn → 🧶 **Knitting Nook** → products
→ 🏪 **Market Stall** → coins → 🛋️ **Comfort Shop** → happier cats → better fluff.

## Win and lose

- A **day** lasts 90 seconds. There are **5 days**.
- At the end of Day 5 the **Fashion Show** scores everything you made.
  Bronze / Silver / Gold / **Master Knitter**. Your best score is remembered.
- **You cannot lose.** Ignored cats get grumpy and their fluff gets scruffy
  and cheap — that's the punishment. Nothing dies, nothing runs away.

## Must-Have — the smallest version that is a real game

- Grandma walks around with the keyboard, drawn as a proper little
  character with a body, not just a floating head
- 4 starting cats with **personalities**: Lazy 😴, Playful 🧸, Diva 💅,
  Curious 🔍, Mischievous 😼, Affectionate 🥰 — each behaves differently
- **Mood** per cat (Grumpy → Content → Happy → Blissful), decays over time,
  restored by grooming and by things you buy
- The full chain: **groom → spin → knit → sell**
- **Rare fur**: happier cats give ✨ Glitter, 🌈 Rainbow, 💫 Glow and
  🌌 Galaxy fluff, worth wildly more
- Coins, the Comfort Shop, and adopting more cats
- 5-day timer with an end-of-day summary
- Fashion Show results screen + best-ever score
- Cosy generated music with the cats **singing along in tune**, plus
  meows when you groom and the odd meow from across the village

## Nice-To-Have — only once the above is finished and fun

- Sunrise/sunset colour shift through the day
- Sparkle particles on rare fluff
- A mischievous cat that occasionally steals a ball of yarn
- Ambient meows

## Not Today — honestly, these will not fit

- **Cat genetics / breeding combos** (Cloud + Star = Nebula). This is a
  whole second game. It needs a breeding UI, a discovery log and dozens of
  species. Cut.
- **Placing buildings yourself** (cat cafés, climbing towers, sun rooms as
  things you position on a map). We get the *effect* of these through the
  Comfort Shop instead — same benefit, a tenth of the work.
- **Automation tiers** (auto-groomers, delivery cats, caretakers). Needs a
  much longer game to be satisfying; in 5 short days it just removes the
  fun bit.
- **Multiple rooms / scrolling world.** One screen, always visible.
- **Saving your farm between sessions.** Best score only.

If the core is done early and everyone's happy, genetics is the first thing
we'd look at adding back.

## Files

```
index.html      the page
css/style.css   the page around the game
js/config.js    EVERY number and word — this is the one to fiddle with
js/engine.js    the machinery. Rarely touched.
js/game.js      the rules of the game.
```

**To play:** double-click `index.html`. That's it — no installing anything.
