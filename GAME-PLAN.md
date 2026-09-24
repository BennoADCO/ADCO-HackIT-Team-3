# 😾 Grandma's Last Stand — Game Plan

## The pitch

The alley cats are furious, and they're throwing furballs at Grandma.
Dodge them for five days in a row — each day sends a bigger, faster wave —
and see if she comes out the other side still standing.

## Controls

| Key | What it does |
|---|---|
| **Arrow keys** or **W A S D** | Walk Grandma around — dodging is the whole game |
| **M** | Mute the music |
| **R** | Restart (on the game over / victory screens) |

## The core loop — the first 10 seconds

1. Grandma 👵 stands in the garden. A handful of angry cats 😾 are prowling
   around the plaza.
2. Every so often, a cat pauses and throws a furball straight at wherever
   Grandma is standing.
3. Keep moving — a furball travels in a straight line, so stepping aside
   dodges it clean.
4. Get hit and she loses HP (shown as a red bar over her head); dodge one
   off the edge of the screen and it counts towards her score.

## Win and lose

- A **day** lasts 45 seconds. There are **5 days**, and each one throws a
  bigger wave of cats than the last.
- Survive a day and Grandma gets a little HP back overnight before the
  next, harder wave arrives.
- Run out of HP at any point and it's **Game Over**.
- Survive all 5 days and you **win** — Grandma has seen off the invasion.
- **Score** is the number of furballs successfully dodged. Best score is
  remembered between plays.

## Must-Have — the smallest version that is a real game

- Grandma walks around with the keyboard, drawn as a proper little
  character with a body, not just a floating head
- **Random enemy cats**, several types, spawned in a **wave each day** —
  later days bring more cats that throw faster and harder
- Furballs fly in a straight line towards wherever Grandma was standing
  when thrown, and hurt her if they connect
- Grandma's HP bar, a brief flicker of safety right after being hit, and
  a **Game Over** screen if it reaches 0
- A dodge counter as the score, with a best-ever score remembered
- 5-day timer with an end-of-day summary, and a **Victory** screen for
  surviving all 5 days
- Cosy generated music, plus a throw sound and a hit sound

## Nice-To-Have — only once the above is finished and fun

- A couple more enemy cat types with different attack patterns
- Screen shake when Grandma is hit
- Furballs that curve or home in slightly, on the hardest days only

## Not Today — honestly, these will not fit

- **Fighting back.** Grandma dodges only — no aiming, no weapons. Adding
  an attack means a second control scheme and enemy health bars; cut.
- **The old grooming/knitting economy.** This game replaced it entirely —
  there's no fluff, yarn, shop, or Fashion Show any more.
- **Multiple rooms / scrolling world.** One screen, always visible.
- **Saving your run between sessions.** Best score only.

## Files

```
index.html      the page
css/style.css   the page around the game
js/config/      EVERY number and word — these are the ones to fiddle with
  basics.js       day length, and Grandma herself
  enemies.js      the enemy cats: names, speed, furballs, how waves grow
  village.js      colours, trees, flowers, welcome screen
  sound.js        the music and the meows
  words.js        the words on screen
js/engine/      the machinery (pens, keyboard, sound, loop). Rarely touched.
js/rules/       WHAT HAPPENS — Grandma, the enemy cats, the days
js/drawing/     WHAT IT LOOKS LIKE — the garden, the characters, the screens
js/main.js      starts everything up

```

**To play:** double-click `index.html`. That's it — no installing anything.
