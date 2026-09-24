/* ==========================================================================
   RULES / BOSS.JS  —  BIG TONY
   ==========================================================================

   The boss cat. He is just an enemy cat like all the others, so the
   normal prowling, throwing and swiping code in rules/enemies.js and
   rules/biscuit.js all works on him — he simply has much bigger numbers
   and an 'isBoss' flag.

   Three things are special about him:
     1. On his day, he turns up ALONE.
     2. Knock him down and he joins Grandma instead of running off.
     3. If he survives his day he escapes, and then tags along with every
        later wave until he's finally beaten.

   All his numbers live in js/config/boss.js.
   ========================================================================== */

/* Is this the day the boss turns up? */
function isBossDay(day) {
  return day === CONFIG.BOSS_DAY;
}

/* Builds Big Tony. He is shaped exactly like a normal enemy cat (see
   makeEnemy in rules/enemies.js), just with the boss's numbers. */
function makeBigTony() {
  var b = CONFIG.BOSS;
  var area = CONFIG.ENEMY_AREA;

  return {
    isBoss: true,
    name: b.name,
    emoji: b.emoji,
    colour: b.colour,

    furballSpeed: b.furballSpeed,
    furballSize: b.furballSize,
    furballsPerThrow: b.furballsPerThrow,
    spreadDegrees: b.spreadDegrees,
    damage: b.damage,
    fireSeconds: b.fireSeconds,
    fireTimer: 1.6,              // a moment's grace before the first throw

    /* How many swipes he's already taken. He remembers this between days,
       so chipping away at him over several days eventually works. */
    hitsTaken: state.tonyHitsTaken || 0,
    hitsToBeat: b.hitsToBeat,

    wanderSpeed: b.wanderSpeed,
    pauseSeconds: b.pauseSeconds,
    minimumGap: b.minimumGap,

    headSize: b.headSize,
    bodyWidth: b.bodyWidth,
    bodyHeight: b.bodyHeight,

    /* He starts at the top of the garden, dead centre. */
    x: (area.left + area.right) / 2,
    y: area.top,
    targetX: ENGINE.randomBetween(area.left, area.right),
    targetY: ENGINE.randomBetween(area.top, area.bottom),
    pauseTimer: 0.5,
    bob: 0
  };
}

/* Whichever enemy on screen is the boss, or nothing if he isn't here. */
function bossOnScreen() {
  for (var i = 0; i < state.enemies.length; i++) {
    if (state.enemies[i].isBoss) { return state.enemies[i]; }
  }
  return null;
}


/* ==========================================================================
   KNOCKING HIM DOWN — he changes sides
   ========================================================================== */

/* Called from rules/biscuit.js when the swipes finally add up. Instead of
   running off like a normal cat, Big Tony joins Grandma. */
function recruitBigTony(boss) {
  var where = state.enemies.indexOf(boss);
  if (where >= 0) { state.enemies.splice(where, 1); }

  state.tonyRecruited = true;
  state.tonyOutThere = false;
  state.tonyHitsTaken = 0;

  /* He gets up again as one of Grandma's cats, right where he fell. */
  var tony = makeFollowerCat(CONFIG.TONY_JOINS);
  tony.x = boss.x;
  tony.y = boss.y;
  tony.attack = CONFIG.TONY_ATTACK;   // slower swipes, but each counts double
  tony.size = CONFIG.TONY_SIZE;
  tony.followGap = CONFIG.TONY_FOLLOW_GAP;
  state.cats.push(tony);

  addParticle(boss.x, boss.y - 80, CONFIG.BOSS_WORDS.beaten, '#e5484d', 26);
  sparkle(boss.x, boss.y - 20, '#ffd24a');
  sparkle(boss.x - 40, boss.y - 40, '#ffe9a8');
  sparkle(boss.x + 40, boss.y - 40, '#ffe9a8');
  say(CONFIG.BOSS_WORDS.joins);
  ENGINE.sound('fanfare');

  /* If he was the last one standing, hold on the moment for a couple of
     seconds and then finish the day early. */
  if (state.enemies.length === 0) {
    state.bossCelebrate = CONFIG.BOSS.celebrateSeconds;
  }
}

/* The little pause after he joins, before the end-of-day screen. */
function updateBossCelebration(dt) {
  if (state.bossCelebrate <= 0) { return; }

  state.bossCelebrate -= dt;
  if (state.bossCelebrate <= 0) {
    state.bossCelebrate = 0;
    endDayEarly();
  }
}


/* ==========================================================================
   HIM GETTING AWAY — if the clock beats Biscuit to it
   ========================================================================== */

/* Called when a day ends. If the boss is still standing, he legs it, and
   the game remembers how battered he already is. */
function noteBossEscaped() {
  var boss = bossOnScreen();
  if (!boss) { return; }

  state.tonyOutThere = true;
  state.tonyHitsTaken = boss.hitsTaken || 0;
}

/* Halfway-down taunt, so there's a sense of progress on a long fight. */
function checkBossWobble(boss) {
  if (boss.saidHalfway) { return; }
  if (boss.hitsTaken < boss.hitsToBeat / 2) { return; }
  boss.saidHalfway = true;
  say(CONFIG.BOSS_WORDS.halfway);
}
