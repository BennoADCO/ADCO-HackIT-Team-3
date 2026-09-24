/* ==========================================================================
   RULES / GRANDMA.JS  —  GRANDMA
   ==========================================================================

   Walking her around with the keyboard, and working out what she's
   standing next to.
   ========================================================================== */

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
   GRANDMA'S HP (hit points)
   ==========================================================================
   Nothing hurts her yet. When you want something to, call
   hurtGrandma(10) from anywhere and she loses 10 HP.
   If her HP reaches 0, it's game over.
   ========================================================================== */

function hurtGrandma(amount) {
  state.grandma.hp = ENGINE.clamp(state.grandma.hp - amount, 0, CONFIG.GRANDMA.maxHp);
}

function isGrandmaOutOfHp() {
  return state.grandma.hp <= 0;
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
