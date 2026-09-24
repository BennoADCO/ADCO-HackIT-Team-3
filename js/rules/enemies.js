/* ==========================================================================
   RULES / ENEMIES.JS  —  THE ENEMY CATS AND THEIR FURBALLS
   ==========================================================================

   Spawning a day's wave, the cats prowling about and throwing furballs,
   and what happens when a furball reaches Grandma.
   ========================================================================== */

/* Empties the garden and fills it with a fresh wave for this day. Later
   days get more cats, thrown from CONFIG.WAVE_SIZES. */
function spawnWave(day) {
  state.enemies = [];
  state.furballs = [];

  var sizes = CONFIG.WAVE_SIZES;
  var count = sizes[Math.min(day, sizes.length) - 1];

  /* Every day beyond the first, cats throw a bit faster. */
  var speedup = Math.pow(CONFIG.WAVE_FIRE_SPEEDUP_PER_DAY, day - 1);

  for (var i = 0; i < count; i++) {
    state.enemies.push(makeEnemy(ENGINE.randomFrom(CONFIG.ENEMY_TYPES), speedup));
  }
}

function makeEnemy(type, fireSpeedup) {
  var area = CONFIG.ENEMY_AREA;
  return {
    name: type.name,
    emoji: type.emoji,
    colour: type.colour,
    furballSpeed: type.furballSpeed,
    damage: type.damage,
    fireSeconds: type.fireSeconds * fireSpeedup,

    x: ENGINE.randomBetween(area.left, area.right),
    y: ENGINE.randomBetween(area.top, area.bottom),
    targetX: ENGINE.randomBetween(area.left, area.right),
    targetY: ENGINE.randomBetween(area.top, area.bottom),
    pauseTimer: ENGINE.randomBetween(0, CONFIG.ENEMY_PAUSE_SECONDS),
    bob: ENGINE.randomBetween(0, 6),

    /* Staggered so a whole wave doesn't throw on the same beat. */
    fireTimer: ENGINE.randomBetween(0.4, type.fireSeconds * fireSpeedup)
  };
}

function updateEnemies(dt) {
  for (var i = 0; i < state.enemies.length; i++) {
    var enemy = state.enemies[i];

    /* --- Throwing furballs -------------------------------------------- */
    enemy.fireTimer -= dt;
    if (enemy.fireTimer <= 0) {
      enemy.fireTimer = enemy.fireSeconds * ENGINE.randomBetween(0.85, 1.15);
      throwFurball(enemy);
    }

    /* --- Prowling about, same idea as a cat pottering ------------------ */
    enemy.bob += dt * 3;
    if (enemy.pauseTimer > 0) {
      enemy.pauseTimer -= dt;
      continue;
    }

    var dx = enemy.targetX - enemy.x;
    var dy = enemy.targetY - enemy.y;
    var gap = Math.sqrt(dx * dx + dy * dy);
    if (gap < 4) {
      enemy.pauseTimer = ENGINE.randomBetween(CONFIG.ENEMY_PAUSE_SECONDS * 0.5,
                                              CONFIG.ENEMY_PAUSE_SECONDS * 1.5);
      enemy.targetX = ENGINE.randomBetween(CONFIG.ENEMY_AREA.left, CONFIG.ENEMY_AREA.right);
      enemy.targetY = ENGINE.randomBetween(CONFIG.ENEMY_AREA.top, CONFIG.ENEMY_AREA.bottom);
    } else {
      enemy.x += (dx / gap) * CONFIG.ENEMY_WANDER_SPEED * dt;
      enemy.y += (dy / gap) * CONFIG.ENEMY_WANDER_SPEED * dt;
    }
  }
}

/* Cats are happy to stand on top of each other, but it looks like one cat
   with too many ears. Nudge any overlapping pair gently apart. */
function keepEnemiesApart() {
  var minimumGap = CONFIG.ENEMY_MINIMUM_GAP;

  for (var a = 0; a < state.enemies.length; a++) {
    for (var b = a + 1; b < state.enemies.length; b++) {
      var one = state.enemies[a];
      var two = state.enemies[b];

      var dx = two.x - one.x;
      var dy = two.y - one.y;
      var gap = Math.sqrt(dx * dx + dy * dy);

      if (gap > minimumGap) { continue; }
      if (gap < 0.01) { dx = 1; dy = 0; gap = 1; }

      var push = (minimumGap - gap) / 2;
      one.x -= (dx / gap) * push;
      one.y -= (dy / gap) * push;
      two.x += (dx / gap) * push;
      two.y += (dy / gap) * push;
    }
  }

  var area = CONFIG.ENEMY_AREA;
  for (var i = 0; i < state.enemies.length; i++) {
    state.enemies[i].x = ENGINE.clamp(state.enemies[i].x, area.left, area.right);
    state.enemies[i].y = ENGINE.clamp(state.enemies[i].y, area.top, area.bottom);
  }
}


/* ==========================================================================
   FURBALLS
   ========================================================================== */

/* A furball leaves the enemy's current spot, aimed at wherever Grandma is
   standing right now. It flies in a straight line from there — it doesn't
   home in on her afterwards, so running sideways genuinely dodges it. */
function throwFurball(enemy) {
  var dx = state.grandma.x - enemy.x;
  var dy = state.grandma.y - enemy.y;
  var gap = Math.sqrt(dx * dx + dy * dy);
  if (gap < 0.01) { dx = 0; dy = -1; gap = 1; }

  state.furballs.push({
    x: enemy.x,
    y: enemy.y,
    dx: dx / gap,
    dy: dy / gap,
    speed: enemy.furballSpeed,
    damage: enemy.damage
  });

  ENGINE.sound('throw');
}

function updateFurballs(dt) {
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;

  for (var i = state.furballs.length - 1; i >= 0; i--) {
    var f = state.furballs[i];
    f.x += f.dx * f.speed * dt;
    f.y += f.dy * f.speed * dt;

    /* Did it just reach Grandma? Hitbox is smaller than she looks on
       screen, per the house rule — generous collision feels fair. */
    if (state.grandma.invulnerable <= 0) {
      var reach = CONFIG.GRANDMA.hitRadius + CONFIG.FURBALL_SIZE / 2;
      var hitGap = ENGINE.distance(f.x, f.y, state.grandma.x, state.grandma.y);
      if (hitGap < reach) {
        hurtGrandma(f.damage);
        state.dayHits++;
        state.grandma.invulnerable = CONFIG.GRANDMA_INVULNERABLE_SECONDS;
        addParticle(state.grandma.x, state.grandma.y - 60, '-' + f.damage + ' 💥', '#e5484d', 20);
        ENGINE.sound('hit');
        state.furballs.splice(i, 1);
        continue;
      }
    }

    /* Off the edge of the picture, uncaught — a clean dodge. */
    if (f.x < -20 || f.x > W + 20 || f.y < -20 || f.y > H + 20) {
      state.furballs.splice(i, 1);
      state.dodged++;
    }
  }
}
