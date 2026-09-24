/* ==========================================================================
   RULES / CATS.JS  —  THE CATS
   ==========================================================================

   How a cat is made, how its health drips away, how its coat grows back,
   how it wanders about, and the odd bit of mischief.
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

    health: 70,
    fluff: ENGINE.randomBetween(0.3, 1),
    bob: ENGINE.randomBetween(0, 6),
    mischiefTimer: CONFIG.MISCHIEF_EVERY_SECONDS
  };
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

/* How much the things you've bought slow down this cat's health dropping. */
function decayMultiplierFor(cat) {
  var fx = CONFIG.UPGRADE_EFFECTS;
  var multiplier = 1;

  if (state.upgrades.toys) {
    multiplier *= (cat.personalityKey === 'playful')
      ? fx.toysPlayfulDecay
      : fx.toysAllDecay;
  }
  if (state.upgrades.lounge) {
    multiplier *= fx.loungeAllDecay;
  }
  if (state.upgrades.parlour && cat.personalityKey === 'diva') {
    multiplier *= fx.parlourDivaDecay;
  }
  return multiplier;
}

function updateCat(cat, dt) {
  var p = cat.personality;

  /* --- Health slowly drips away --------------------------------------- */
  var decay = CONFIG.HEALTH_DECAY_PER_SECOND * p.healthDecay * decayMultiplierFor(cat);
  cat.health -= decay * dt;

  /* --- Curious cats perk up when Grandma is close --------------------- */
  if (cat.personalityKey === 'curious') {
    var howFar = ENGINE.distance(cat.x, cat.y, state.grandma.x, state.grandma.y);
    if (howFar < CONFIG.CURIOUS_RANGE) {
      cat.health += CONFIG.CURIOUS_HEALTH_PER_SECOND * dt;
    }
  }

  cat.health = ENGINE.clamp(cat.health, 0, 100);

  /* --- The coat grows back ------------------------------------------- */
  if (cat.fluff < 1) {
    cat.fluff += (p.regrowSpeed / CONFIG.FLUFF_REGROW_SECONDS) * dt;
    if (cat.fluff > 1) { cat.fluff = 1; }
  }

  /* --- Mischievous cats pinch the odd ball of yarn -------------------- */
  if (cat.personalityKey === 'mischievous') {
    cat.mischiefTimer -= dt;
    if (cat.mischiefTimer <= 0) {
      cat.mischiefTimer = CONFIG.MISCHIEF_EVERY_SECONDS;
      stealYarn(cat);
    }
  }

  /* --- Pottering about ------------------------------------------------ */
  cat.bob += dt * 3;
  if (cat.pauseTimer > 0) {
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

  /* And keep everybody on the rug. */
  var area = CONFIG.CAT_AREA;
  for (var i = 0; i < state.cats.length; i++) {
    state.cats[i].x = ENGINE.clamp(state.cats[i].x, area.left, area.right);
    state.cats[i].y = ENGINE.clamp(state.cats[i].y, area.top, area.bottom);
  }
}

/* A mischievous cat takes the cheapest ball of yarn it can find. */
function stealYarn(cat) {
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    var key = CONFIG.RARITIES[i].key;
    if (state.yarn[key] > 0) {
      state.yarn[key] -= 1;
      say(cat.emoji + ' ' + cat.name + ' ran off with a ball of yarn!');
      ENGINE.meow(CONFIG.AUDIO.meowBasePitch * 1.3);
      addParticle(cat.x, cat.y - 30, '-1 🧶', '#c86a6a', 16);
      return;
    }
  }
}
