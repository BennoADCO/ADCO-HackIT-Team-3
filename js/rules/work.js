/* ==========================================================================
   RULES / WORK.JS  —  DOING THE WORK
   ==========================================================================

   Groom -> spin -> knit -> sell. What happens when you press Space next
   to a cat or one of the little shops.
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
   The heart of the game. A healthier cat gives more fluff AND is far more
   likely to grow magical fur.
   ------------------------------------------------------------------------ */

function doGroom(cat) {
  var tier = healthTierFor(cat);
  var p = cat.personality;

  var amount = Math.round(p.fluffPerGroom * tier.fluffValue);
  if (amount < 1) { amount = 1; }

  var fur = rollFur(cat, tier);
  state.fluff[fur.key] += amount;
  state.dayStats.fluff += amount;
  state.seasonStats.fluff += amount;

  cat.fluff = 0;
  cat.health = ENGINE.clamp(cat.health + CONFIG.GROOM_HEALTH_BONUS * p.groomJoy, 0, 100);

  ENGINE.meow(CONFIG.AUDIO.meowBasePitch * ENGINE.randomBetween(0.82, 1.25));
  addParticle(cat.x, cat.y - 34, '+' + amount + ' ' + fur.emoji, fur.colour, 18);

  if (fur.key !== 'plain') {
    state.dayStats.rares += amount;
    ENGINE.sound('rare');
    say(fur.name + ' fur from ' + cat.name + '! Worth ' + fur.value + 'x as much.');
    sparkle(cat.x, cat.y, fur.colour);
  }
}

/* Rolls for magical fur. Health, personality and the Grooming Parlour all
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
