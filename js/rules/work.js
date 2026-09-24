/* ==========================================================================
   RULES / WORK.JS  —  GROOMING
   ==========================================================================

   What happens when you press Space next to a cat: Grandma stops for a
   moment, brushes it, and the cat gets some health back.
   ========================================================================== */

function tryToStartAction(thing) {
  if (!thing) { return; }

  if (thing.kind === 'cat') {
    beginAction('groom', thing.cat, CONFIG.GROOM_SECONDS);
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
}


/* --- Grooming ------------------------------------------------------------
   The heart of the game. Every brush gives the cat some health back.
   You can groom as often as you like.
   ------------------------------------------------------------------------ */

function doGroom(cat) {
  var before = cat.health;
  var heal = CONFIG.GROOM_HEALTH_BONUS * cat.personality.groomJoy;
  cat.health = ENGINE.clamp(cat.health + heal, 0, 100);

  /* How much it actually went up (it can't go past 100). */
  var gained = Math.round(cat.health - before);

  state.dayStats.grooms += 1;

  ENGINE.meow(CONFIG.AUDIO.meowBasePitch * ENGINE.randomBetween(0.82, 1.25));
  addParticle(cat.x, cat.y - 34, '+' + gained + ' 💚', CONFIG.CAT_HEALTH_BAR_COLOUR, 18);

  /* A knocked-out cat might be well enough to get up now. */
  checkCatWakesUp(cat);

  if (cat.health >= 100) {
    say(cat.name + ' is glowing with health!');
    sparkle(cat.x, cat.y, '#ffd24a');
  }
}
