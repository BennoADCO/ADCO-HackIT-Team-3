/* ==========================================================================
   RULES / GEAR.JS  —  WEAPONS AND ARMOUR FOR THE FRIENDLY CATS
   ==========================================================================

   1. A beaten enemy sometimes leaves a drop on the ground.
   2. Grandma walks over it and picks it up.
   3. The game pauses and asks which friendly cat should get it.
   4. That cat moves up one step on the WEAPONS or ARMOUR list.

   Each cat remembers its step on each list as a number — its "level".
   0 is the first line of the list (bare paws / no armour).

   All the numbers are in js/config/gear.js.
   ========================================================================== */

/* What a cat is holding and wearing right now: the whole line from config. */
function weaponFor(cat) {
  return CONFIG.WEAPONS[cat.weaponLevel || 0];
}

function armourFor(cat) {
  return CONFIG.ARMOUR[cat.armourLevel || 0];
}


/* ==========================================================================
   1. DROPPING
   ========================================================================== */

/* Called when an enemy is beaten (see js/rules/biscuit.js). Rolls the
   dice, and maybe leaves a weapon or armour drop where the enemy was. */
function maybeDropGear(x, y) {
  if (Math.random() >= CONFIG.GEAR_DROP_CHANCE) { return; }

  var kind = (Math.random() < CONFIG.GEAR_WEAPON_CHANCE) ? 'weapon' : 'armour';
  state.drops.push({ kind: kind, x: x, y: y, bob: 0 });
  sparkle(x, y - 20, '#ffd24a');
}


/* ==========================================================================
   2. PICKING UP
   ========================================================================== */

/* Every frame: bob the drops about, and if Grandma is standing on one,
   pick it up and ask who should get it. */
function updateDrops(dt) {
  for (var i = state.drops.length - 1; i >= 0; i--) {
    var drop = state.drops[i];
    drop.bob += dt * 4;

    var gap = ENGINE.distance(state.grandma.x, state.grandma.y, drop.x, drop.y);
    if (gap < CONFIG.GEAR_PICKUP_RANGE) {
      state.drops.splice(i, 1);
      state.gearChoice = { kind: drop.kind };
      ENGINE.sound('rare');
      return;   // one at a time
    }
  }
}


/* ==========================================================================
   3. CHOOSING WHICH CAT GETS IT
   ==========================================================================
   While state.gearChoice is set, the game is paused (see js/main.js) and
   this runs instead. Cat number 1 is the first cat in the list, and so on.
   ========================================================================== */

function updateGearChoice() {
  var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (var i = 0; i < state.cats.length && i < keys.length; i++) {
    if (ENGINE.wasPressed(keys[i])) {
      giveGear(state.cats[i], state.gearChoice.kind);
      state.gearChoice = null;
      return;
    }
  }
}


/* ==========================================================================
   4. PUTTING IT ON
   ========================================================================== */

function giveGear(cat, kind) {
  var list = (kind === 'weapon') ? CONFIG.WEAPONS : CONFIG.ARMOUR;
  var levelName = (kind === 'weapon') ? 'weaponLevel' : 'armourLevel';
  var level = cat[levelName] || 0;

  /* Already got the best? Then a good heal instead, so it's not wasted. */
  if (level >= list.length - 1) {
    cat.health = ENGINE.clamp(cat.health + CONFIG.GEAR_MAXED_HEAL, 0, 100);
    addParticle(cat.x, cat.y - 60, '+' + CONFIG.GEAR_MAXED_HEAL + ' 💚', CONFIG.CAT_HEALTH_BAR_COLOUR, 18);
    say(cat.name + ' ' + CONFIG.GEAR_WORDS.alreadyBest);
    checkCatWakesUp(cat);
    ENGINE.sound('buy');
    return;
  }

  cat[levelName] = level + 1;
  var item = list[level + 1];
  addParticle(cat.x, cat.y - 70, item.emoji + ' ' + item.name + '!', '#ffd24a', 20);
  sparkle(cat.x, cat.y - 30, '#ffd24a');
  say(cat.name + ' ' + CONFIG.GEAR_WORDS.equipped + ' ' + item.name + '! ' + item.emoji);
  ENGINE.sound('buy');
}
