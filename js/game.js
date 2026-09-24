/* ==========================================================================
   GAME.JS  —  THE RULES
   ==========================================================================

   This is the game itself: what the cats do, what happens when Grandma
   grooms one, how fluff turns into yarn, and how the Fashion Show is
   scored.

   If you want to change HOW MUCH something is worth, or HOW FAST something
   happens, that number lives in config.js. Change it there.
   If you want to change WHAT HAPPENS, it's in here.

   The game is always in one of four screens:
     'title'   — the front page
     'playing' — actually playing
     'dayEnd'  — the end-of-day summary
     'show'    — the Fashion Show, at the end of the season
   ========================================================================== */

var ctx = null;

/* Everything the game needs to remember lives in this one box. */
var state = null;


/* ==========================================================================
   SETTING UP
   ========================================================================== */

function startGame() {
  ctx = ENGINE.setupCanvas('game');
  ENGINE.startListening();
  resetGame();
  state.screen = 'title';
  ENGINE.startLoop(everyFrame);
}

/* Wipes the slate clean and starts a brand new season. */
function resetGame() {
  var best = state ? state.bestScore : ENGINE.loadBestScore();

  state = {
    screen: 'playing',
    day: 1,
    dayTime: 0,

    grandma: { x: CONFIG.GRANDMA.startX, y: CONFIG.GRANDMA.startY, bob: 0, walking: false },

    cats: [],
    coins: 0,
    prestige: 0,

    fluff: emptyBag(),
    yarn: emptyBag(),
    products: [],
    showcase: [],

    upgrades: { toys: false, lounge: false, parlour: false },
    adoptCost: shopItem('adopt').cost,
    nextAdoptIndex: 0,

    action: null,
    particles: [],
    message: '',
    messageTimer: 0,
    ambientMeowTimer: CONFIG.AUDIO.ambientMeowSeconds,

    dayStats: freshDayStats(),
    seasonStats: { fluff: 0, products: 0, coins: 0 },

    bestScore: best,
    beatBest: false
  };

  for (var i = 0; i < CONFIG.STARTING_CATS.length; i++) {
    state.cats.push(makeCat(CONFIG.STARTING_CATS[i]));
  }
}

function freshDayStats() {
  return { fluff: 0, yarn: 0, products: 0, coins: 0, prestige: 0, rares: 0 };
}

/* A "bag" holds a count for each kind of fur: plain, glitter, rainbow... */
function emptyBag() {
  var bag = {};
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    bag[CONFIG.RARITIES[i].key] = 0;
  }
  return bag;
}

function bagTotal(bag) {
  var total = 0;
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    total += bag[CONFIG.RARITIES[i].key];
  }
  return total;
}

function shopItem(key) {
  for (var i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
    if (CONFIG.SHOP_ITEMS[i].key === key) { return CONFIG.SHOP_ITEMS[i]; }
  }
  return null;
}

function stationByKey(key) {
  for (var i = 0; i < CONFIG.STATIONS.length; i++) {
    if (CONFIG.STATIONS[i].key === key) { return CONFIG.STATIONS[i]; }
  }
  return null;
}


/* ==========================================================================
   THE CATS
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

    mood: 70,
    fluff: ENGINE.randomBetween(0.3, 1),
    bob: ENGINE.randomBetween(0, 6),
    mischiefTimer: CONFIG.MISCHIEF_EVERY_SECONDS
  };
}

/* Which mood band is this cat in? Returns the whole tier from config. */
function moodTierFor(cat) {
  var tiers = CONFIG.MOOD_TIERS;
  var best = tiers[0];
  for (var i = 0; i < tiers.length; i++) {
    if (cat.mood >= tiers[i].min) { best = tiers[i]; }
  }
  return best;
}

/* How much the things you've bought slow down this cat's grumpiness. */
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

  /* --- Mood slowly drips away --------------------------------------- */
  var decay = CONFIG.MOOD_DECAY_PER_SECOND * p.moodDecay * decayMultiplierFor(cat);
  cat.mood -= decay * dt;

  /* --- Curious cats perk up when Grandma is close --------------------- */
  if (cat.personalityKey === 'curious') {
    var howFar = ENGINE.distance(cat.x, cat.y, state.grandma.x, state.grandma.y);
    if (howFar < CONFIG.CURIOUS_RANGE) {
      cat.mood += CONFIG.CURIOUS_MOOD_PER_SECOND * dt;
    }
  }

  cat.mood = ENGINE.clamp(cat.mood, 0, 100);

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


/* ==========================================================================
   WHAT GRANDMA IS STANDING NEXT TO
   ==========================================================================
   Every frame we work out the single nearest thing within arm's reach.
   That's what Space will use.
   ========================================================================== */

function findNearestThing() {
  var best = null;
  var bestDistance = CONFIG.GRANDMA.reach;
  var i, d;

  for (i = 0; i < state.cats.length; i++) {
    d = ENGINE.distance(state.grandma.x, state.grandma.y, state.cats[i].x, state.cats[i].y);
    if (d < bestDistance) {
      bestDistance = d;
      best = { kind: 'cat', cat: state.cats[i] };
    }
  }

  for (i = 0; i < CONFIG.STATIONS.length; i++) {
    var s = CONFIG.STATIONS[i];
    d = ENGINE.distance(state.grandma.x, state.grandma.y, s.x, s.y);
    if (d < bestDistance) {
      bestDistance = d;
      best = { kind: 'station', station: s };
    }
  }

  return best;
}


/* ==========================================================================
   DOING THE WORK
   ========================================================================== */

function tryToStartAction(thing) {
  if (!thing) { return; }

  if (thing.kind === 'cat') {
    if (thing.cat.fluff < 1) {
      say(thing.cat.name + ' is still growing its coat.');
      ENGINE.sound('deny');
      return;
    }
    beginAction('groom', thing.cat, CONFIG.GROOM_SECONDS);

  } else {
    var key = thing.station.key;

    if (key === 'spin') {
      if (bagTotal(state.fluff) < CONFIG.FLUFF_PER_YARN) {
        say('Not enough fluff yet — you need ' + CONFIG.FLUFF_PER_YARN + ' of a kind.');
        ENGINE.sound('deny');
        return;
      }
      beginAction('spin', thing.station, CONFIG.SPIN_SECONDS);

    } else if (key === 'knit') {
      if (bagTotal(state.yarn) < CONFIG.YARN_PER_PRODUCT) {
        say('Not enough yarn yet — you need ' + CONFIG.YARN_PER_PRODUCT + ' of a kind.');
        ENGINE.sound('deny');
        return;
      }
      beginAction('knit', thing.station, CONFIG.KNIT_SECONDS);

    } else if (key === 'sell') {
      if (state.products.length === 0) {
        say('Nothing knitted to sell yet.');
        ENGINE.sound('deny');
        return;
      }
      beginAction('sell', thing.station, CONFIG.SELL_SECONDS);
    }
    /* The shop isn't an action — you press number keys there instead. */
  }
}

function beginAction(kind, target, duration) {
  state.action = { kind: kind, target: target, elapsed: 0, duration: duration };
}

function updateAction(dt) {
  var a = state.action;
  a.elapsed += dt;
  if (a.elapsed >= a.duration) {
    state.action = null;
    finishAction(a);
  }
}

function finishAction(a) {
  if (a.kind === 'groom') { doGroom(a.target); }
  else if (a.kind === 'spin') { doSpin(); }
  else if (a.kind === 'knit') { doKnit(); }
  else if (a.kind === 'sell') { doSell(); }
}


/* --- Grooming ------------------------------------------------------------
   The heart of the game. A happier cat gives more fluff AND is far more
   likely to grow magical fur.
   ------------------------------------------------------------------------ */

function doGroom(cat) {
  var tier = moodTierFor(cat);
  var p = cat.personality;

  var amount = Math.round(p.fluffPerGroom * tier.fluffValue);
  if (amount < 1) { amount = 1; }

  var fur = rollFur(cat, tier);
  state.fluff[fur.key] += amount;
  state.dayStats.fluff += amount;
  state.seasonStats.fluff += amount;

  cat.fluff = 0;
  cat.mood = ENGINE.clamp(cat.mood + CONFIG.GROOM_MOOD_BONUS * p.groomJoy, 0, 100);

  ENGINE.meow(CONFIG.AUDIO.meowBasePitch * ENGINE.randomBetween(0.82, 1.25));
  addParticle(cat.x, cat.y - 34, '+' + amount + ' ' + fur.emoji, fur.colour, 18);

  if (fur.key !== 'plain') {
    state.dayStats.rares += amount;
    ENGINE.sound('rare');
    say(fur.name + ' fur from ' + cat.name + '! Worth ' + fur.value + 'x as much.');
    sparkle(cat.x, cat.y, fur.colour);
  }
}

/* Rolls for magical fur. Mood, personality and the Grooming Parlour all
   push the odds up; plain fur never changes. */
function rollFur(cat, tier) {
  var boost = tier.rareChance * cat.personality.rareBonus;
  if (state.upgrades.parlour) {
    boost *= CONFIG.UPGRADE_EFFECTS.parlourRareBoost;
  }

  var weights = [];
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    var r = CONFIG.RARITIES[i];
    weights.push(r.key === 'plain' ? r.weight : r.weight * boost);
  }
  return ENGINE.weightedPick(CONFIG.RARITIES, weights);
}


/* --- Spinning and knitting ----------------------------------------------
   Both work in one go: Grandma spins EVERYTHING she can carry, then knits
   EVERYTHING she can. No trudging back and forth three balls at a time.
   ------------------------------------------------------------------------ */

function doSpin() {
  var made = 0;
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    var key = CONFIG.RARITIES[i].key;
    var batches = Math.floor(state.fluff[key] / CONFIG.FLUFF_PER_YARN);
    if (batches > 0) {
      state.fluff[key] -= batches * CONFIG.FLUFF_PER_YARN;
      state.yarn[key] += batches;
      made += batches;
    }
  }
  state.dayStats.yarn += made;
  ENGINE.sound('spin');
  var wheel = stationByKey('spin');
  addParticle(wheel.x, wheel.y - 50, '+' + made + ' 🧶', '#8a5fd6', 20);
  say('Spun ' + made + ' ' + (made === 1 ? 'ball' : 'balls') + ' of yarn.');
}

function doKnit() {
  var made = 0;
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    var rarity = CONFIG.RARITIES[i];
    var batches = Math.floor(state.yarn[rarity.key] / CONFIG.YARN_PER_PRODUCT);
    for (var n = 0; n < batches; n++) {
      var type = ENGINE.randomFrom(CONFIG.PRODUCTS);
      state.products.push({
        name: type.name,
        emoji: type.emoji,
        rarity: rarity,
        value: type.base * rarity.value
      });
      made++;
    }
    state.yarn[rarity.key] -= batches * CONFIG.YARN_PER_PRODUCT;
  }

  state.dayStats.products += made;
  state.seasonStats.products += made;
  ENGINE.sound('knit');

  var nook = stationByKey('knit');
  addParticle(nook.x, nook.y - 50, '+' + made + ' 🧣', '#4f9e52', 20);
  say('Knitted ' + made + ' ' + (made === 1 ? 'piece' : 'pieces') + '.');
}


/* --- Selling -------------------------------------------------------------
   Selling does two things at once: it pays you coins to spend on the cats,
   and it enters the piece into the Fashion Show ledger. There's no reason
   ever to hoard, which keeps the game simple to explain.
   ------------------------------------------------------------------------ */

function doSell() {
  var earned = 0;
  var i;

  for (i = 0; i < state.products.length; i++) {
    var item = state.products[i];
    earned += item.value;
    state.showcase.push(item);
  }

  state.coins += earned;
  state.prestige += earned;
  state.dayStats.coins += earned;
  state.dayStats.prestige += earned;
  state.seasonStats.coins += earned;

  var sold = state.products.length;
  state.products = [];

  /* Keep only the very finest pieces for the Fashion Show display. */
  state.showcase.sort(function (a, b) { return b.value - a.value; });
  if (state.showcase.length > CONFIG.SHOWCASE_COUNT) {
    state.showcase.length = CONFIG.SHOWCASE_COUNT;
  }

  ENGINE.sound('sell');
  var stall = stationByKey('sell');
  addParticle(stall.x, stall.y - 50, '+' + earned + ' 🪙', CONFIG.COLOURS.coin, 22);
  say('Sold ' + sold + ' ' + (sold === 1 ? 'piece' : 'pieces') + ' for ' + earned + ' coins.');
}


/* ==========================================================================
   THE COMFORT SHOP
   ========================================================================== */

function tryToBuy(index) {
  var item = CONFIG.SHOP_ITEMS[index];
  if (!item) { return; }

  var cost = (item.key === 'adopt') ? state.adoptCost : item.cost;

  if (item.key !== 'adopt' && state.upgrades[item.key]) {
    say('You already have the ' + item.name + '.');
    ENGINE.sound('deny');
    return;
  }

  if (state.coins < cost) {
    say('Not enough coins — the ' + item.name + ' costs ' + cost + '.');
    ENGINE.sound('deny');
    return;
  }

  state.coins -= cost;
  ENGINE.sound('buy');

  if (item.key === 'adopt') {
    var recipe = CONFIG.ADOPTABLE_CATS[state.nextAdoptIndex % CONFIG.ADOPTABLE_CATS.length];
    state.nextAdoptIndex++;
    var cat = makeCat(recipe);
    state.cats.push(cat);
    state.adoptCost += CONFIG.ADOPT_COST_INCREASE;
    ENGINE.meow(CONFIG.AUDIO.meowBasePitch * 1.15);
    say(cat.emoji + ' ' + cat.name + ' the ' + cat.personality.name +
        ' cat has moved in! ' + cat.personality.blurb);
    sparkle(cat.x, cat.y, '#ffd24a');
  } else {
    state.upgrades[item.key] = true;
    say(item.emoji + ' ' + item.name + ' installed. ' + item.blurb);
    /* Every cat is immediately a bit more cheerful about the new thing. */
    for (var i = 0; i < state.cats.length; i++) {
      state.cats[i].mood = ENGINE.clamp(state.cats[i].mood + 15, 0, 100);
    }
  }
}


/* ==========================================================================
   THE PASSING OF THE DAY
   ========================================================================== */

function updateDayClock(dt) {
  state.dayTime += dt;
  if (state.dayTime < CONFIG.DAY_LENGTH_SECONDS) { return; }

  state.dayTime = CONFIG.DAY_LENGTH_SECONDS;
  state.action = null;

  if (state.day >= CONFIG.DAYS_IN_SEASON) {
    finishSeason();
  } else {
    state.screen = 'dayEnd';
    ENGINE.sound('dayEnd');
  }
}

function startNextDay() {
  state.day++;
  state.dayTime = 0;
  state.dayStats = freshDayStats();

  /* A good night's sleep does everybody good. */
  for (var i = 0; i < state.cats.length; i++) {
    state.cats[i].mood = ENGINE.clamp(
      state.cats[i].mood + CONFIG.OVERNIGHT_MOOD_RECOVERY, 0, 100);
    state.cats[i].fluff = 1;
  }

  state.screen = 'playing';
}

function finishSeason() {
  state.screen = 'show';
  state.beatBest = state.prestige > state.bestScore;
  if (state.beatBest) {
    state.bestScore = state.prestige;
    ENGINE.saveBestScore(state.prestige);
  }
  ENGINE.sound('fanfare');
}

function medalFor(score) {
  var best = CONFIG.MEDALS[0];
  for (var i = 0; i < CONFIG.MEDALS.length; i++) {
    if (score >= CONFIG.MEDALS[i].min) { best = CONFIG.MEDALS[i]; }
  }
  return best;
}


/* ==========================================================================
   LITTLE FLOATING NUMBERS AND MESSAGES
   ========================================================================== */

function addParticle(x, y, text, colour, size) {
  state.particles.push({
    x: x, y: y, text: text, colour: colour, size: size || 16,
    life: 1.4, maxLife: 1.4, riseSpeed: 42
  });
}

/* A burst of little sparks, for when something rare happens. */
function sparkle(x, y, colour) {
  for (var i = 0; i < 10; i++) {
    state.particles.push({
      x: x + ENGINE.randomBetween(-26, 26),
      y: y + ENGINE.randomBetween(-26, 26),
      text: '✦', colour: colour, size: ENGINE.randomBetween(10, 20),
      life: 0.9, maxLife: 0.9, riseSpeed: ENGINE.randomBetween(20, 70)
    });
  }
}

function updateParticles(dt) {
  for (var i = state.particles.length - 1; i >= 0; i--) {
    var p = state.particles[i];
    p.life -= dt;
    p.y -= p.riseSpeed * dt;
    if (p.life <= 0) { state.particles.splice(i, 1); }
  }
}

/* Shows a line of text at the top of the screen for a few seconds. */
function say(text) {
  state.message = text;
  state.messageTimer = 3.2;
}


/* ==========================================================================
   THE FRAME — runs about 60 times a second
   ========================================================================== */

function everyFrame(dt) {
  if (ENGINE.wasPressed('m')) { ENGINE.toggleMute(); }

  if (state.screen === 'title') {
    if (ENGINE.wasPressed(' ', 'enter')) { resetGame(); }
    drawTitleScreen();
    return;
  }

  if (state.screen === 'dayEnd') {
    if (ENGINE.wasPressed(' ', 'enter')) { startNextDay(); }
    drawWorld();
    drawDayEndScreen();
    return;
  }

  if (state.screen === 'show') {
    if (ENGINE.wasPressed('r', ' ', 'enter')) { resetGame(); }
    drawWorld();
    drawFashionShow();
    return;
  }

  updatePlaying(dt);
  drawWorld();
  drawHud();
  drawBottomBar();
  drawMessage();
}

function updatePlaying(dt) {
  updateDayClock(dt);
  if (state.screen !== 'playing') { return; }

  var i;

  /* Grandma only moves when she isn't in the middle of a job. */
  if (state.action) {
    updateAction(dt);
    state.grandma.walking = false;
  } else {
    moveGrandma(dt);

    var thing = findNearestThing();
    if (ENGINE.wasPressed(' ')) {
      tryToStartAction(thing);
    }

    /* Number keys only do anything while you're standing at the shop. */
    if (thing && thing.kind === 'station' && thing.station.key === 'shop') {
      for (i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
        if (ENGINE.wasPressed(String(i + 1))) { tryToBuy(i); }
      }
    }
  }

  for (i = 0; i < state.cats.length; i++) {
    updateCat(state.cats[i], dt);
  }
  keepCatsApart();

  updateParticles(dt);

  if (state.messageTimer > 0) { state.messageTimer -= dt; }

  /* The occasional meow from somewhere across the sanctuary. */
  state.ambientMeowTimer -= dt;
  if (state.ambientMeowTimer <= 0) {
    state.ambientMeowTimer = CONFIG.AUDIO.ambientMeowSeconds * ENGINE.randomBetween(0.6, 1.5);
    if (state.cats.length > 0) {
      ENGINE.meow(CONFIG.AUDIO.meowBasePitch * ENGINE.randomBetween(0.7, 1.3));
    }
  }
}

function moveGrandma(dt) {
  var dx = 0;
  var dy = 0;

  if (ENGINE.isHeld('arrowleft', 'a')) { dx -= 1; }
  if (ENGINE.isHeld('arrowright', 'd')) { dx += 1; }
  if (ENGINE.isHeld('arrowup', 'w')) { dy -= 1; }
  if (ENGINE.isHeld('arrowdown', 's')) { dy += 1; }

  state.grandma.walking = (dx !== 0 || dy !== 0);
  if (!state.grandma.walking) { return; }

  /* Diagonally you'd otherwise travel 1.41x faster, which feels wrong. */
  var length = Math.sqrt(dx * dx + dy * dy);
  dx /= length;
  dy /= length;

  state.grandma.x += dx * CONFIG.GRANDMA.speed * dt;
  state.grandma.y += dy * CONFIG.GRANDMA.speed * dt;
  /* Keep her on the visible grass, clear of the two bars. These are her
     FEET, and her head sticks up about 70 dots above them. */
  state.grandma.x = ENGINE.clamp(state.grandma.x, 44, CONFIG.CANVAS_WIDTH - 44);
  state.grandma.y = ENGINE.clamp(state.grandma.y, 178, CONFIG.CANVAS_HEIGHT - 76);
  state.grandma.bob += dt * 11;
}


/* ==========================================================================
   DRAWING THE SANCTUARY
   ========================================================================== */

function drawWorld() {
  drawGrass();
  drawPlaza();
  drawScenery();
  drawStations();
  drawCatsAndGrandma();
  drawParticles();
  drawDayTint();
}

/* --- The ground ----------------------------------------------------------
   Drawn as a soft checkerboard of two greens, the way a village life-sim
   does it, with a scattering of grass tufts on top for texture.
   ------------------------------------------------------------------------ */

var grassTufts = null;   /* worked out once, then reused every frame */

function drawGrass() {
  var tile = CONFIG.GRASS.tile;
  var acrossCount = Math.ceil(CONFIG.CANVAS_WIDTH / tile);
  var downCount = Math.ceil(CONFIG.CANVAS_HEIGHT / tile);

  ctx.fillStyle = CONFIG.COLOURS.grassLight;
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  ctx.fillStyle = CONFIG.COLOURS.grassDark;
  for (var down = 0; down < downCount; down++) {
    for (var across = 0; across < acrossCount; across++) {
      if ((across + down) % 2 === 0) { continue; }
      ctx.fillRect(across * tile, down * tile, tile, tile);
    }
  }

  /* Pick the tuft positions the first time, then keep them still. */
  if (!grassTufts) {
    grassTufts = [];
    for (var n = 0; n < CONFIG.GRASS.tuftCount; n++) {
      grassTufts.push({
        x: ENGINE.randomBetween(0, CONFIG.CANVAS_WIDTH),
        y: ENGINE.randomBetween(0, CONFIG.CANVAS_HEIGHT),
        lean: ENGINE.randomBetween(-2.5, 2.5)
      });
    }
  }

  ctx.strokeStyle = CONFIG.GRASS.tuftColour;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (var t = 0; t < grassTufts.length; t++) {
    var tuft = grassTufts[t];
    ctx.beginPath();
    ctx.moveTo(tuft.x, tuft.y);
    ctx.lineTo(tuft.x + tuft.lean, tuft.y - 5);
    ctx.stroke();
  }
}

/* The paved square in the middle, where the cats live. */
function drawPlaza() {
  var p = CONFIG.PLAZA;
  ENGINE.drawShadow(p.x + p.w / 2, p.y + p.h + 4, p.w / 2.1, 10);
  ENGINE.fillRound(p.x, p.y, p.w, p.h, 54, CONFIG.COLOURS.plaza);
  ENGINE.strokeRound(p.x, p.y, p.w, p.h, 54, CONFIG.COLOURS.plazaEdge, 6);
  ENGINE.strokeRound(p.x + 16, p.y + 16, p.w - 32, p.h - 32, 42,
                     'rgba(224, 200, 148, 0.55)', 2);
}

function drawScenery() {
  var i;

  for (i = 0; i < CONFIG.FLOWERS.length; i++) {
    ENGINE.drawFlower(CONFIG.FLOWERS[i].x, CONFIG.FLOWERS[i].y, CONFIG.FLOWERS[i].colour);
  }

  for (i = 0; i < CONFIG.TREES.length; i++) {
    var tree = CONFIG.TREES[i];
    ENGINE.drawTree(tree.x, tree.y, tree.size, CONFIG.COLOURS);
  }

  for (i = 0; i < CONFIG.DECORATIONS.length; i++) {
    var d = CONFIG.DECORATIONS[i];
    ENGINE.drawEmoji(d.emoji, d.x, d.y, d.size);
  }
}

/* --- The four little shops -----------------------------------------------
   Each one is a cream building with a coloured roof and a sign.
   ------------------------------------------------------------------------ */

function drawStations() {
  var nearest = (state.screen === 'playing' && !state.action) ? findNearestThing() : null;

  for (var i = 0; i < CONFIG.STATIONS.length; i++) {
    var s = CONFIG.STATIONS[i];
    var lit = nearest && nearest.kind === 'station' && nearest.station.key === s.key;

    var wallLeft = s.x - 70;
    var wallTop = s.y - 24;
    var wallWidth = 140;
    var wallHeight = 78;

    ENGINE.drawShadow(s.x, s.y + wallHeight - 22, 74, 13);

    /* The roof, slightly wider than the walls so it overhangs. */
    ENGINE.fillRound(s.x - 80, s.y - 56, 160, 38, 13, s.roof);
    ENGINE.fillRound(s.x - 80, s.y - 30, 160, 14, 7, ENGINE.shade(s.roof, -28));

    /* The walls. */
    ENGINE.fillRound(wallLeft, wallTop, wallWidth, wallHeight, 12, CONFIG.COLOURS.panel);
    ENGINE.strokeRound(wallLeft, wallTop, wallWidth, wallHeight, 12,
                       lit ? '#f0b429' : CONFIG.COLOURS.panelEdge, lit ? 5 : 3);

    /* The sign in the window, then the name plate. */
    ENGINE.drawEmoji(s.emoji, s.x, s.y + 4, CONFIG.STATION_SIZE);
    ENGINE.drawText(s.label, s.x, s.y + 32, 13, CONFIG.COLOURS.ink);
    ENGINE.drawText(s.hint, s.x, s.y + 45, 10, CONFIG.COLOURS.inkSoft, 'center', 'normal');

    /* The shop advertises its keys so nobody has to be told twice. */
    if (s.key === 'shop' && lit) {
      ENGINE.fillRound(s.x - 44, s.y - 82, 88, 22, 11, '#5d4733');
      ENGINE.drawText('press 1 - 4', s.x, s.y - 71, 12, '#ffd24a');
    }
  }
}

function drawCatsAndGrandma() {
  /* Sort by how far down the screen things are, so closer things overlap
     further ones. It's a cheap trick that makes it look solid. */
  var everything = [];
  var i;

  for (i = 0; i < state.cats.length; i++) {
    everything.push({ y: state.cats[i].y, cat: state.cats[i] });
  }
  everything.push({ y: state.grandma.y, grandma: true });
  everything.sort(function (a, b) { return a.y - b.y; });

  var nearest = (state.screen === 'playing' && !state.action) ? findNearestThing() : null;

  for (i = 0; i < everything.length; i++) {
    if (everything[i].grandma) {
      drawGrandma();
    } else {
      drawCat(everything[i].cat, nearest);
    }
  }
}

function drawCat(cat, nearest) {
  var tier = moodTierFor(cat);
  var bob = Math.sin(cat.bob) * 1.6;

  var isTarget = (nearest && nearest.kind === 'cat' && nearest.cat === cat);
  var isBeingGroomed = (state.action && state.action.kind === 'groom' &&
                        state.action.target === cat);

  /* A golden ring on the ground shows who Space will groom. */
  if (isTarget || isBeingGroomed) {
    ctx.beginPath();
    ctx.ellipse(cat.x, cat.y + 2, 34, 13, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#f0b429';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  var headY = ENGINE.drawVillager({
    emoji: cat.emoji,
    x: cat.x,
    y: cat.y,
    lift: bob,
    headSize: CONFIG.CAT.headSize,
    bodyWidth: CONFIG.CAT.bodyWidth,
    bodyHeight: CONFIG.CAT.bodyHeight,
    bodyColour: cat.colour,
    trimColour: 'rgba(255, 255, 255, 0.45)',
    tail: true
  });

  /* The personality badge, tucked over its shoulder. */
  ENGINE.drawEmoji(cat.personality.emoji, cat.x + 21, headY + 12, 17);

  /* A cloud above the head means "ready for a brush". */
  if (cat.fluff >= 1) {
    ENGINE.drawEmoji('☁️', cat.x, headY - 24 + Math.sin(cat.bob * 1.6) * 3, 24);
  }

  /* A little name tag under its feet, with the mood bar built in.
     The bar's colour IS the mood, so there's no need to spell it out. */
  ENGINE.fillRound(cat.x - 33, cat.y + 6, 66, 28, 9, 'rgba(255, 250, 240, 0.95)');
  ENGINE.strokeRound(cat.x - 33, cat.y + 6, 66, 28, 9, CONFIG.COLOURS.panelEdge, 2);
  ENGINE.drawText(cat.name, cat.x, cat.y + 15, 11, CONFIG.COLOURS.ink);
  ENGINE.drawBar(cat.x - 24, cat.y + 24, 48, 6, cat.mood / 100, tier.colour,
                 'rgba(0, 0, 0, 0.12)');
}

function drawGrandma() {
  var g = CONFIG.GRANDMA;
  var bob = state.grandma.walking ? Math.abs(Math.sin(state.grandma.bob)) * 3 : 0;

  var headY = ENGINE.drawVillager({
    emoji: g.emoji,
    x: state.grandma.x,
    y: state.grandma.y,
    lift: -bob,
    headSize: g.headSize,
    bodyWidth: g.bodyWidth,
    bodyHeight: g.bodyHeight,
    bodyColour: g.bodyColour,
    trimColour: g.trimColour
  });

  /* The bar that fills up while she's busy with a job. */
  if (state.action) {
    var a = state.action;
    ENGINE.drawBar(state.grandma.x - 34, headY - 34, 68, 10,
                   a.elapsed / a.duration, '#f0b429', 'rgba(255,255,255,0.85)');
    ENGINE.drawEmoji('🪡', state.grandma.x + 30, headY + 6, 20);
  }
}

function drawParticles() {
  for (var i = 0; i < state.particles.length; i++) {
    var p = state.particles[i];
    var fade = ENGINE.clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = fade;
    ENGINE.drawText(p.text, p.x, p.y, p.size, p.colour);
    ctx.globalAlpha = 1;
  }
}

/* A gentle wash of colour that shifts from morning to evening. */
function drawDayTint() {
  if (state.screen === 'title') { return; }
  var through = state.dayTime / CONFIG.DAY_LENGTH_SECONDS;
  var stops = CONFIG.DAY_TINT;

  var chosen = stops[0].colour;
  for (var i = 0; i < stops.length; i++) {
    if (through >= stops[i].at) { chosen = stops[i].colour; }
  }
  ctx.fillStyle = chosen;
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
}


/* ==========================================================================
   THE BAR ALONG THE TOP
   ========================================================================== */

function drawHud() {
  var W = CONFIG.CANVAS_WIDTH;
  ENGINE.fillRound(14, 10, W - 28, 50, 14, CONFIG.COLOURS.hudBar);

  var ink = CONFIG.COLOURS.hudText;

  /* Day counter and the clock. */
  ENGINE.drawText('DAY ' + state.day + ' / ' + CONFIG.DAYS_IN_SEASON, 34, 35, 16, ink, 'left');
  ENGINE.drawBar(132, 29, 132, 12, state.dayTime / CONFIG.DAY_LENGTH_SECONDS,
                 '#ffd24a', 'rgba(0,0,0,0.35)');

  drawHudChip('🪙', state.coins, 330, CONFIG.COLOURS.coin);
  drawHudChip('☁️', bagTotal(state.fluff), 450, '#ffffff');
  drawHudChip('🧶', bagTotal(state.yarn), 560, '#e9c9a3');
  drawHudChip('🧣', state.products.length, 668, '#9fe3a0');
  drawHudChip('🏆', state.prestige, 800, '#ffd24a');

  /* If you're holding anything magical, show it off just below. */
  drawRarityPips();

  if (ENGINE.isMuted()) {
    ENGINE.drawText('🔇 muted (M)', W - 30, 74, 12, '#6b5a47', 'right');
  }
}

function drawHudChip(emoji, value, x, colour) {
  ENGINE.drawEmoji(emoji, x - 26, 35, 22);
  ENGINE.drawText(String(value), x + 2, 35, 19, colour, 'left');
}

function drawRarityPips() {
  var parts = [];
  for (var i = 1; i < CONFIG.RARITIES.length; i++) {
    var r = CONFIG.RARITIES[i];
    var count = state.fluff[r.key] + state.yarn[r.key];
    if (count > 0) { parts.push({ r: r, count: count }); }
  }
  if (parts.length === 0) { return; }

  /* A dark pill behind them, so the colours stay readable on the grass. */
  var width = parts.length * 58 + 16;
  var startX = 470;
  ENGINE.fillRound(startX - 26, 62, width, 28, 14, 'rgba(74, 59, 47, 0.82)');

  var x = startX;
  for (var n = 0; n < parts.length; n++) {
    ENGINE.drawEmoji(parts[n].r.emoji, x - 8, 76, 16);
    ENGINE.drawText('x' + parts[n].count, x + 4, 77, 14, parts[n].r.colour, 'left');
    x += 58;
  }
}


/* ==========================================================================
   THE BAR ALONG THE BOTTOM — always tells you what to do next
   ========================================================================== */

function drawBottomBar() {
  var W = CONFIG.CANVAS_WIDTH;
  var y = CONFIG.CANVAS_HEIGHT - 66;
  ENGINE.fillRound(14, y, W - 28, 54, 14, CONFIG.COLOURS.hudBar);

  var midY = y + 27;
  var ink = CONFIG.COLOURS.hudText;

  /* Busy? Say what she's doing. */
  if (state.action) {
    var names = { groom: 'Grooming', spin: 'Spinning', knit: 'Knitting', sell: 'Selling' };
    var what = names[state.action.kind];
    if (state.action.kind === 'groom') { what += ' ' + state.action.target.name; }
    ENGINE.drawText(what + '...', W / 2, midY, 18, '#ffd24a');
    return;
  }

  var thing = findNearestThing();

  /* At the shop, the bar becomes the shop. */
  if (thing && thing.kind === 'station' && thing.station.key === 'shop') {
    drawShopBar(y);
    return;
  }

  if (thing && thing.kind === 'cat') {
    var cat = thing.cat;
    var tier = moodTierFor(cat);
    if (cat.fluff >= 1) {
      ENGINE.drawText('SPACE', 46, midY, 17, '#ffd24a', 'left');
      ENGINE.drawText('Groom ' + cat.name, 118, midY, 18, ink, 'left');
    } else {
      ENGINE.drawText(cat.name + "'s coat is growing back", 46, midY, 17, '#c9b8a4', 'left');
    }
    ENGINE.drawText(cat.personality.emoji + '  ' + cat.personality.name + ' · ' +
                    tier.name + ' · ' + cat.personality.blurb,
                    W - 46, midY, 14, '#d8c8b4', 'right', 'normal');
    return;
  }

  if (thing && thing.kind === 'station') {
    ENGINE.drawText('SPACE', 46, midY, 17, '#ffd24a', 'left');
    ENGINE.drawText('Use the ' + thing.station.label, 118, midY, 18, ink, 'left');
    ENGINE.drawText(thing.station.hint, W - 46, midY, 14, '#c9b8a4', 'right', 'normal');
    return;
  }

  /* Standing in open space: just say what to do next. */
  ENGINE.drawEmoji('👉', 52, midY, 20);
  ENGINE.drawText(nextStepHint(), 76, midY, 17, ink, 'left');
}

/* Works out the single most useful thing to tell the player right now. */
function nextStepHint() {
  if (state.products.length > 0) { return CONFIG.TEXT.needSell; }
  if (bagTotal(state.yarn) >= CONFIG.YARN_PER_PRODUCT) { return CONFIG.TEXT.needKnit; }
  if (bagTotal(state.fluff) >= CONFIG.FLUFF_PER_YARN) { return CONFIG.TEXT.needSpin; }

  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].fluff >= 1) { return CONFIG.TEXT.needFluff; }
  }

  if (state.coins >= cheapestShopCost()) { return CONFIG.TEXT.needShop; }
  return CONFIG.TEXT.waiting;
}

function cheapestShopCost() {
  var cheapest = Infinity;
  for (var i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
    var item = CONFIG.SHOP_ITEMS[i];
    if (item.key === 'adopt') {
      cheapest = Math.min(cheapest, state.adoptCost);
    } else if (!state.upgrades[item.key]) {
      cheapest = Math.min(cheapest, item.cost);
    }
  }
  return cheapest;
}

function drawShopBar(barY) {
  var slotWidth = (CONFIG.CANVAS_WIDTH - 40) / CONFIG.SHOP_ITEMS.length;

  for (var i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
    var item = CONFIG.SHOP_ITEMS[i];
    var owned = (item.key !== 'adopt') && state.upgrades[item.key];
    var cost = (item.key === 'adopt') ? state.adoptCost : item.cost;
    var affordable = state.coins >= cost;

    var left = 20 + i * slotWidth;
    var labelColour = owned ? '#7d9a7d' : (affordable ? '#fff6e6' : '#a89684');
    var costColour = owned ? '#7d9a7d' : (affordable ? '#ffd24a' : '#d08a8a');

    ENGINE.drawText(String(i + 1), left + 16, barY + 20, 16,
                    owned ? '#7d9a7d' : '#ffd24a', 'left');
    ENGINE.drawEmoji(item.emoji, left + 38, barY + 20, 18);
    ENGINE.drawText(item.name, left + 52, barY + 20, 14, labelColour, 'left');
    ENGINE.drawText(owned ? 'installed ✓' : (cost + ' coins'),
                    left + 52, barY + 38, 13, costColour, 'left', 'normal');

    if (i < CONFIG.SHOP_ITEMS.length - 1) {
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.fillRect(left + slotWidth - 4, barY + 10, 1, 34);
    }
  }
}

function drawMessage() {
  if (state.messageTimer <= 0 || !state.message) { return; }
  var fade = ENGINE.clamp(state.messageTimer / 0.8, 0, 1);

  ctx.globalAlpha = fade;
  ctx.font = 'bold 15px "Trebuchet MS", "Segoe UI", Verdana, sans-serif';
  var width = ctx.measureText(state.message).width + 44;
  var x = CONFIG.CANVAS_WIDTH / 2 - width / 2;

  ENGINE.fillRound(x, 92, width, 34, 17, 'rgba(74, 59, 47, 0.92)');
  ENGINE.drawText(state.message, CONFIG.CANVAS_WIDTH / 2, 109, 15, '#fff6e6');
  ctx.globalAlpha = 1;
}


/* ==========================================================================
   THE THREE FULL-SCREEN PANELS
   ========================================================================== */

function dimBackground(strength) {
  ctx.fillStyle = 'rgba(40, 30, 22, ' + strength + ')';
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
}

function panel(x, y, w, h) {
  ENGINE.fillRound(x, y, w, h, 24, CONFIG.COLOURS.panelSolid);
  ENGINE.strokeRound(x, y, w, h, 24, CONFIG.COLOURS.panelEdge, 5);
}

/* ==========================================================================
   THE WELCOME SCREEN
   ==========================================================================
   The first thing anybody sees, so it does a lot of work: it names the
   game, shows the characters, explains the whole loop in four words, and
   gives one obvious button to press.
   ========================================================================== */

var titleFloaters = null;

function drawTitleScreen() {
  var W = CONFIG.CANVAS_WIDTH;
  var T = CONFIG.TITLE;
  var seconds = Date.now() / 1000;

  /* The village carries on behind, softly blurred out by a dark vignette. */
  drawGrass();
  drawPlaza();
  drawScenery();
  drawVignette();
  drawTitleFloaters(seconds);

  /* --- The card ----------------------------------------------------- */
  var cardX = 130, cardY = 76, cardW = 640, cardH = 456;

  ENGINE.fillRound(cardX + 6, cardY + 14, cardW, cardH, 34, 'rgba(45, 32, 20, 0.35)');
  ENGINE.fillRound(cardX, cardY, cardW, cardH, 34, CONFIG.COLOURS.panelSolid);
  ENGINE.strokeRound(cardX, cardY, cardW, cardH, 34, '#ffffff', 7);
  ENGINE.strokeRound(cardX, cardY, cardW, cardH, 34, CONFIG.COLOURS.panelEdge, 2);

  drawBunting(cardX + 34, cardX + cardW - 34, cardY + 6);

  /* --- The cast, bobbing gently -------------------------------------- */
  var bob = Math.sin(seconds * 2.4) * 3;
  drawTitleCat(CONFIG.STARTING_CATS[1], 344, 214, bob);
  drawTitleCat(CONFIG.STARTING_CATS[3], 556, 214, -bob);

  ENGINE.drawVillager({
    emoji: CONFIG.GRANDMA.emoji, x: 450, y: 222,
    lift: -Math.abs(Math.sin(seconds * 2.4)) * 4,
    headSize: 58, bodyWidth: 46, bodyHeight: 44,
    bodyColour: CONFIG.GRANDMA.bodyColour, trimColour: CONFIG.GRANDMA.trimColour
  });

  /* --- The name ------------------------------------------------------ */
  ENGINE.drawStickerText(CONFIG.GAME_TITLE, W / 2, 278, 46,
                         T.inkFill, T.inkOutline, T.inkShadow);
  ENGINE.drawText(CONFIG.GAME_SUBTITLE, W / 2, 312, 16,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');

  /* --- The whole game, in four pills --------------------------------- */
  drawLoopChips(W / 2, 356);

  /* --- The hook ------------------------------------------------------ */
  ENGINE.drawText('Happy cats grow magical fur. ' + CONFIG.DAYS_IN_SEASON +
                  ' days until the Fashion Show.',
                  W / 2, 392, 15, CONFIG.COLOURS.ink, 'center', 'normal');

  /* --- The one button ------------------------------------------------ */
  drawStartButton(W / 2, 438, seconds);

  /* --- The small print ----------------------------------------------- */
  if (state.bestScore > 0) {
    ENGINE.fillRound(W / 2 - 88, 470, 176, 26, 13, '#fbeed2');
    ENGINE.drawEmoji('🏆', W / 2 - 58, 483, 15);
    ENGINE.drawText('Best ever  ' + state.bestScore, W / 2 + 12, 484, 14, '#a06a2c');
  }

  ENGINE.drawText(CONFIG.TEXT.controls, W / 2, 512, 13,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');
}

/* Emoji drifting slowly up the background, like bubbles. */
function drawTitleFloaters(seconds) {
  var T = CONFIG.TITLE;

  if (!titleFloaters) {
    titleFloaters = [];
    for (var n = 0; n < T.floaterCount; n++) {
      titleFloaters.push({
        emoji: ENGINE.randomFrom(T.floaters),
        x: ENGINE.randomBetween(20, CONFIG.CANVAS_WIDTH - 20),
        offset: ENGINE.randomBetween(0, 700),
        size: ENGINE.randomBetween(18, 34),
        speed: ENGINE.randomBetween(14, 30),
        sway: ENGINE.randomBetween(0, 6)
      });
    }
  }

  for (var i = 0; i < titleFloaters.length; i++) {
    var f = titleFloaters[i];

    /* Drift upwards and wrap around to the bottom again. */
    var travelled = f.offset + seconds * f.speed;
    var y = CONFIG.CANVAS_HEIGHT + 40 - (travelled % (CONFIG.CANVAS_HEIGHT + 80));
    var x = f.x + Math.sin(seconds * 0.7 + f.sway) * 16;

    ctx.globalAlpha = 0.85;
    ENGINE.drawEmoji(f.emoji, x, y, f.size);
    ctx.globalAlpha = 1;
  }
}

/* A dark edge all the way round, so the card in the middle pops forward. */
function drawVignette() {
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;
  var glow = ctx.createRadialGradient(W / 2, H / 2, 140, W / 2, H / 2, 560);
  glow.addColorStop(0, 'rgba(40, 28, 16, 0.10)');
  glow.addColorStop(1, 'rgba(40, 28, 16, 0.62)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

/* Little triangle flags strung across the top of the card. */
function drawBunting(fromX, toX, y) {
  var colours = CONFIG.TITLE.buntingColours;
  var flagCount = 13;
  var step = (toX - fromX) / flagCount;

  ctx.strokeStyle = '#c9a87d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, y);
  ctx.quadraticCurveTo((fromX + toX) / 2, y + 12, toX, y);
  ctx.stroke();

  for (var i = 0; i < flagCount; i++) {
    var alongBy = (i + 0.5) / flagCount;
    var x = fromX + step * (i + 0.5);

    /* Follow the sag of the string. */
    var sag = 12 * 2 * alongBy * (1 - alongBy) * 2;
    var topY = y + sag;

    ctx.beginPath();
    ctx.moveTo(x - 9, topY);
    ctx.lineTo(x + 9, topY);
    ctx.lineTo(x, topY + 20);
    ctx.closePath();
    ctx.fillStyle = colours[i % colours.length];
    ctx.fill();
  }
}

/* The four steps of the game, as coloured pills with arrows between. */
function drawLoopChips(centreX, y) {
  var chips = CONFIG.TITLE.chips;
  var chipW = 108;
  var gap = 26;
  var totalWidth = chips.length * chipW + (chips.length - 1) * gap;
  var x = centreX - totalWidth / 2;

  for (var i = 0; i < chips.length; i++) {
    var chip = chips[i];

    ENGINE.fillRound(x, y - 18, chipW, 36, 18, chip.fill);
    ENGINE.strokeRound(x, y - 18, chipW, 36, 18, chip.edge, 2);
    ENGINE.drawEmoji(chip.emoji, x + 26, y, 19);
    ENGINE.drawText(chip.label, x + 44, y + 1, 15, CONFIG.COLOURS.ink, 'left');

    if (i < chips.length - 1) {
      ENGINE.drawText('→', x + chipW + gap / 2, y, 18, CONFIG.COLOURS.inkSoft);
    }
    x += chipW + gap;
  }
}

/* One big obvious button. It breathes, so your eye lands on it. */
function drawStartButton(centreX, y, seconds) {
  var T = CONFIG.TITLE;
  var pulse = Math.sin(seconds * 3) * 0.5 + 0.5;
  var width = 320 + pulse * 10;
  var height = 54;
  var left = centreX - width / 2;
  var top = y - height / 2;

  /* A soft halo that swells in and out. */
  ctx.globalAlpha = 0.16 + pulse * 0.18;
  ENGINE.fillRound(left - 10, top - 8, width + 20, height + 16, 35, T.buttonColour);
  ctx.globalAlpha = 1;

  ENGINE.fillRound(left, top + 5, width, height, 27, T.buttonShadow);
  ENGINE.fillRound(left, top, width, height, 27, T.buttonColour);
  ENGINE.fillRound(left + 16, top + 7, width - 32, height * 0.34, 12,
                   'rgba(255, 255, 255, 0.24)');

  ENGINE.drawText(T.buttonText, centreX, y + 2, 19, '#ffffff');
}

/* One of the cats, posing on the front page. */
function drawTitleCat(recipe, x, y, bob) {
  ENGINE.drawVillager({
    emoji: recipe.emoji, x: x, y: y, lift: bob,
    headSize: 48, bodyWidth: 36, bodyHeight: 26,
    bodyColour: recipe.colour, trimColour: 'rgba(255, 255, 255, 0.45)',
    tail: true
  });
}

function drawDayEndScreen() {
  dimBackground(0.55);
  var W = CONFIG.CANVAS_WIDTH;
  var left = 180;
  var right = W - 180;
  panel(left, 92, right - left, 416);

  var s = state.dayStats;
  ENGINE.drawText('🌙  End of Day ' + state.day, W / 2, 140, 28, CONFIG.COLOURS.ink);

  var rows = [
    ['☁️ Fluff collected', s.fluff],
    ['🧶 Yarn spun', s.yarn],
    ['🧣 Pieces knitted', s.products],
    ['🪙 Coins earned', s.coins],
    ['✨ Magical fur', s.rares]
  ];

  var y = 194;
  for (var i = 0; i < rows.length; i++) {
    ENGINE.drawText(rows[i][0], left + 52, y, 17, CONFIG.COLOURS.ink, 'left', 'normal');
    ENGINE.drawText(String(rows[i][1]), right - 52, y, 19, CONFIG.COLOURS.ink, 'right');
    y += 32;
  }

  ctx.fillStyle = CONFIG.COLOURS.panelEdge;
  ctx.fillRect(left + 52, y - 4, (right - left) - 104, 2);

  ENGINE.drawText('🏆 Fashion Show total so far', left + 52, y + 26, 17,
                  CONFIG.COLOURS.ink, 'left');
  ENGINE.drawText(String(state.prestige), right - 52, y + 26, 24, '#a06a2c', 'right');

  ENGINE.drawText(sleepyNote(), W / 2, y + 68, 14, CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.dayEndPrompt, W / 2, 470, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}

/* A friendly nudge about whichever cat is having the worst time of it.
   Kept short so it always fits inside the panel. */
function sleepyNote() {
  var saddest = null;
  for (var i = 0; i < state.cats.length; i++) {
    if (!saddest || state.cats[i].mood < saddest.mood) { saddest = state.cats[i]; }
  }
  if (!saddest) { return 'The sanctuary is very quiet tonight.'; }
  if (saddest.mood > 60) { return 'Everybody sleeps soundly. The coats look splendid.'; }
  return saddest.emoji + ' ' + saddest.name + ' is feeling neglected. Brush them first tomorrow?';
}

function drawFashionShow() {
  dimBackground(0.68);
  var W = CONFIG.CANVAS_WIDTH;
  panel(150, 58, W - 300, 486);

  var medal = medalFor(state.prestige);

  ENGINE.drawText('🏆  THE FASHION SHOW  🏆', W / 2, 104, 26, CONFIG.COLOURS.ink);
  ENGINE.drawText('Grandma presents her finest work', W / 2, 130, 14,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var y = 172;
  if (state.showcase.length === 0) {
    ENGINE.drawText('Nothing was finished in time. The cats are baffled.',
                    W / 2, y + 20, 16, CONFIG.COLOURS.inkSoft, 'center', 'normal');
    y += 80;
  } else {
    for (var i = 0; i < state.showcase.length; i++) {
      var item = state.showcase[i];
      ENGINE.drawEmoji(item.emoji, 216, y, 24);
      ENGINE.drawEmoji(item.rarity.emoji, 244, y, 18);
      ENGINE.drawText(item.rarity.name + ' ' + item.name, 266, y, 17,
                      CONFIG.COLOURS.ink, 'left');
      ENGINE.drawText(String(item.value), W - 216, y, 18, item.rarity.colour, 'right');
      y += 32;
    }
    y += 10;
  }

  ctx.fillStyle = CONFIG.COLOURS.panelEdge;
  ctx.fillRect(216, y, W - 432, 2);
  y += 30;

  ENGINE.drawText('Season total', 216, y, 18, CONFIG.COLOURS.ink, 'left');
  ENGINE.drawText(String(state.prestige), W - 216, y, 30, '#a06a2c', 'right');
  y += 46;

  ENGINE.drawEmoji(medal.emoji, W / 2 - 130, y + 4, 40);
  ENGINE.drawText(medal.name, W / 2 + 22, y + 4, 26, '#7a4fb8');
  y += 46;

  if (state.beatBest) {
    ENGINE.drawText('✨ A NEW PERSONAL BEST ✨', W / 2, y, 16, '#4f9e52');
  } else {
    ENGINE.drawText('Best ever: ' + state.bestScore, W / 2, y, 15, CONFIG.COLOURS.inkSoft);
  }
  y += 34;

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.showPrompt, W / 2, y + 6, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}


/* ==========================================================================
   Off we go. This runs once the page has finished loading.
   ========================================================================== */

window.addEventListener('load', startGame);
