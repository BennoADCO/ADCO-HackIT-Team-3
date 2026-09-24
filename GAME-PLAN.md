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
5. **Biscuit fights back 🐱💢.** Biscuit automatically swipes at any enemy
   cat close by. Three swipes and that cat runs off 💨 for the rest of the
   day. Walk Grandma towards the enemies to get Biscuit in range — risky,
   but it thins out the furballs. (Chasing cats off doesn't add to score.)

## Day 5 — the Big Tony boss fight 😼👑

- On **Day 5** no wave turns up. Instead one enormous cat does: **Big
  Tony**, twice everyone else's size, with a crown and a great red health
  bar across the top of the screen.
- He throws a **fan of three big furballs** at a time, so you can't just
  stand still and out-wait him.
- It takes **12 bare-pawed Biscuit swipes** to knock him down — so you
  have to keep walking Grandma into range and back out again. Turn up
  with a weapon from the earlier days and it's a lot quicker.
- Knock him down and he **changes sides**. He gets up as one of Grandma's
  cats, trots after her, and swipes at the enemy for the rest of the
  season. His swipes are slower than Biscuit's but count **double**, and
  he can be groomed and given gear like any other cat.
- Beat him and **Day 5 ends there and then**, a couple of seconds after
  the "HE'S JOINED YOU" moment.
- **Miss the window and he gets away** — and then he turns up in *every*
  later wave until he's finally beaten. The damage already done to him is
  remembered from day to day.

## Win and lose

- A **day** lasts 45 seconds. There are **21 days**. Days get busier as
  they go, up to 15 cats at once.
- Survive a day and Grandma gets a little HP back overnight before the
  next, harder wave arrives.
- Run out of HP at any point and it's **Game Over**.
- Survive all 21 days and you **win**.
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
- 21-day timer with an end-of-day summary, and a **Victory** screen for
  surviving the lot
- A **boss cat on Day 5** who joins your side once he's beaten
- Cosy generated music, plus a throw sound and a hit sound

## Nice-To-Have — only once the above is finished and fun

- A couple more enemy cat types with different attack patterns
- Screen shake when Grandma is hit
- Furballs that curve or home in slightly, on the hardest days only

## Not Today — honestly, these will not fit

- **Grandma fighting back.** Grandma still dodges only — no aiming, no
  weapons. Biscuit does the fighting, automatically, with no extra keys.
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
  biscuit.js      how far, how often and how hard Biscuit swipes
  boss.js         Big Tony: which day, how tough, and how he fights for you
  village.js      colours, trees, flowers, welcome screen
  sound.js        the music and the meows
  words.js        the words on screen
js/engine/      the machinery (pens, keyboard, sound, loop). Rarely touched.
js/rules/       WHAT HAPPENS — Grandma, the enemy cats, the days
js/drawing/     WHAT IT LOOKS LIKE — the garden, the characters, the screens
js/main.js      starts everything up

```

**To play:** double-click `index.html`. That's it — no installing anything.
