/* ==========================================================================
   RULES / CATS.JS  —  THE CATS
   ==========================================================================

   How a cat is made, how its health drips away, how it wanders about.
   ========================================================================== */

function makeCat(recipe) {
  var area = CONFIG.CAT_AREA;
  return {
    name: recipe.name,
    emoji: recipe.emoji,
    colour: recipe.colour,
    personalityKey: recipe.personality,
    personality: CONFIG.PERSONALITIES[recipe.personality],

    x: ENGINE.randomBetween(area.left, area.right),
    y: ENGINE.randomBetween(area.top, area.bottom),
    targetX: ENGINE.randomBetween(area.left, area.right),
    targetY: ENGINE.randomBetween(area.top, area.bottom),
    pauseTimer: ENGINE.randomBetween(0, CONFIG.CAT_PAUSE_SECONDS),

    followsGrandma: recipe.followsGrandma === true,

    health: 70,
    bob: ENGINE.randomBetween(0, 6)
  };
}

/* A cat that follows Grandma starts right beside her. */
function makeFollowerCat(recipe) {
  var cat = makeCat(recipe);
  cat.x = CONFIG.GRANDMA.startX - CONFIG.FOLLOW_GAP;
  cat.y = CONFIG.GRANDMA.startY;
  return cat;
}

/* Trot towards Grandma, and stop once close enough. */
function followGrandma(cat, dt) {
  var dx = state.grandma.x - cat.x;
  var dy = state.grandma.y - cat.y;
  var gap = Math.sqrt(dx * dx + dy * dy);
  if (gap <= CONFIG.FOLLOW_GAP) { return; }

  var step = Math.min(CONFIG.FOLLOW_SPEED * dt, gap - CONFIG.FOLLOW_GAP);
  cat.x += (dx / gap) * step;
  cat.y += (dy / gap) * step;
}

/* Which health band is this cat in? Returns the whole tier from config. */
function healthTierFor(cat) {
  var tiers = CONFIG.HEALTH_TIERS;
  var best = tiers[0];
  for (var i = 0; i < tiers.length; i++) {
    if (cat.health >= tiers[i].min) { best = tiers[i]; }
  }
  return best;
}

function updateCat(cat, dt) {
  var p = cat.personality;

  /* --- Health slowly drips away --------------------------------------- */
  var decay = CONFIG.HEALTH_DECAY_PER_SECOND * p.healthDecay;
  cat.health -= decay * dt;

  /* --- Curious cats perk up when Grandma is close --------------------- */
  if (cat.personalityKey === 'curious') {
    var howFar = ENGINE.distance(cat.x, cat.y, state.grandma.x, state.grandma.y);
    if (howFar < CONFIG.CURIOUS_RANGE) {
      cat.health += CONFIG.CURIOUS_HEALTH_PER_SECOND * dt;
    }
  }

  cat.health = ENGINE.clamp(cat.health, 0, 100);

  /* --- Pottering about ------------------------------------------------ */
  cat.bob += dt * 3;
  if (cat.followsGrandma) {
    followGrandma(cat, dt);
  } else if (cat.pauseTimer > 0) {
    cat.pauseTimer -= dt;
  } else {
    var dx = cat.targetX - cat.x;
    var dy = cat.targetY - cat.y;
    var gap = Math.sqrt(dx * dx + dy * dy);
    if (gap < 4) {
      cat.pauseTimer = ENGINE.randomBetween(CONFIG.CAT_PAUSE_SECONDS * 0.5,
                                            CONFIG.CAT_PAUSE_SECONDS * 1.5);
      cat.targetX = ENGINE.randomBetween(CONFIG.CAT_AREA.left, CONFIG.CAT_AREA.right);
      cat.targetY = ENGINE.randomBetween(CONFIG.CAT_AREA.top, CONFIG.CAT_AREA.bottom);
    } else {
      cat.x += (dx / gap) * CONFIG.CAT_WANDER_SPEED * dt;
      cat.y += (dy / gap) * CONFIG.CAT_WANDER_SPEED * dt;
    }
  }
}

/* Cats are perfectly happy sitting on top of each other, but two cats in
   the same spot look like one cat with too many ears and you can't read
   their names. This nudges any overlapping pair gently apart. */
function keepCatsApart() {
  var minimumGap = CONFIG.CAT_MINIMUM_GAP;

  for (var a = 0; a < state.cats.length; a++) {
    for (var b = a + 1; b < state.cats.length; b++) {
      var one = state.cats[a];
      var two = state.cats[b];

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

  /* And keep everybody on the rug — except a cat following Grandma. */
  var area = CONFIG.CAT_AREA;
  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].followsGrandma) { continue; }
    state.cats[i].x = ENGINE.clamp(state.cats[i].x, area.left, area.right);
    state.cats[i].y = ENGINE.clamp(state.cats[i].y, area.top, area.bottom);
  }
}

