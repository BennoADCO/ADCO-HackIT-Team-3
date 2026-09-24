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
  state.clearedFor = 0;   // seconds since the last cat was chased off (see days.js)

  /* Boss day: Big Tony turns up on his own, and nobody else does.
     (See js/rules/boss.js.) */
  if (isBossDay(day) && !state.tonyRecruited) {
    state.enemies.push(makeBigTony());
    return;
  }

  var sizes = CONFIG.WAVE_SIZES;
  var count = sizes[Math.min(day, sizes.length) - 1];

  /* Every day beyond the first, cats throw a bit faster — but only up to
     the floor in js/config/enemies.js, or the last days are unplayable. */
  var speedup = Math.max(CONFIG.WAVE_FIRE_SPEEDUP_FLOOR,
                         Math.pow(CONFIG.WAVE_FIRE_SPEEDUP_PER_DAY, day - 1));

  for (var i = 0; i < count; i++) {
    state.enemies.push(makeEnemy(ENGINE.randomFrom(CONFIG.ENEMY_TYPES), speedup));
  }

  /* Big Tony got away on his day? Then he tags along with this wave too,
     as battered as you left him. */
  if (state.tonyOutThere && !state.tonyRecruited) {
    state.enemies.push(makeBigTony());
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
    /* Most cats use the speeds in js/config/enemies.js. Big Tony carries
       his own, from js/config/boss.js. */
    var wanderSpeed = enemy.wanderSpeed || CONFIG.ENEMY_WANDER_SPEED;
    var pauseSeconds = enemy.pauseSeconds || CONFIG.ENEMY_PAUSE_SECONDS;

    enemy.bob += dt * 3;
    if (enemy.pauseTimer > 0) {
      enemy.pauseTimer -= dt;
      continue;
    }

    var dx = enemy.targetX - enemy.x;
    var dy = enemy.targetY - enemy.y;
    var gap = Math.sqrt(dx * dx + dy * dy);
    if (gap < 4) {
      enemy.pauseTimer = ENGINE.randomBetween(pauseSeconds * 0.5, pauseSeconds * 1.5);
      enemy.targetX = ENGINE.randomBetween(CONFIG.ENEMY_AREA.left, CONFIG.ENEMY_AREA.right);
      enemy.targetY = ENGINE.randomBetween(CONFIG.ENEMY_AREA.top, CONFIG.ENEMY_AREA.bottom);
    } else {
      enemy.x += (dx / gap) * wanderSpeed * dt;
      enemy.y += (dy / gap) * wanderSpeed * dt;
    }
  }
}

/* Cats are happy to stand on top of each other, but it looks like one cat
   with too many ears. Nudge any overlapping pair gently apart. */
function keepEnemiesApart() {
  for (var a = 0; a < state.enemies.length; a++) {
    for (var b = a + 1; b < state.enemies.length; b++) {
      var one = state.enemies[a];
      var two = state.enemies[b];

      /* A big cat needs more elbow room than a little one. */
      var minimumGap = Math.max(one.minimumGap || CONFIG.ENEMY_MINIMUM_GAP,
                                two.minimumGap || CONFIG.ENEMY_MINIMUM_GAP);

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

  /* The direction straight at her, as an angle. */
  var aim = Math.atan2(dy / gap, dx / gap);

  /* Most cats throw one furball. Big Tony throws a fan of them — see
     'furballsPerThrow' in js/config/boss.js. */
  var shots = enemy.furballsPerThrow || 1;
  var spread = (enemy.spreadDegrees || 0) * Math.PI / 180;

  for (var i = 0; i < shots; i++) {
    /* Spread the shots evenly around the aim: one shot goes dead straight,
       three go left / straight / right, and so on. */
    var nudge = (shots === 1) ? 0 : (i / (shots - 1) - 0.5) * spread;
    var angle = aim + nudge;

    state.furballs.push({
      x: enemy.x,
      y: enemy.y,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
      speed: enemy.furballSpeed,
      size: enemy.furballSize || CONFIG.FURBALL_SIZE,
      damage: enemy.damage
    });
  }

  ENGINE.sound(enemy.isBoss ? 'bigShoot' : 'throw');
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
      var reach = CONFIG.GRANDMA.hitRadius + (f.size || CONFIG.FURBALL_SIZE) / 2;
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

    /* Or did it hit one of the friendly cats? (js/rules/knockout.js) */
    if (furballHitsCat(f)) {
      state.furballs.splice(i, 1);
      continue;
    }

    /* Off the edge of the picture, uncaught — a clean dodge. */
    if (f.x < -20 || f.x > W + 20 || f.y < -20 || f.y > H + 20) {
      state.furballs.splice(i, 1);
      state.dodged++;
    }
  }
}
