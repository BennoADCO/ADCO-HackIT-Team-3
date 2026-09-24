/* ==========================================================================
   RULES / GRANDMA.JS  —  GRANDMA
   ==========================================================================

   Walking her around with the keyboard, and her HP.
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
   A furball hit calls hurtGrandma(amount) — see rules/enemies.js.
   If her HP reaches 0, it's game over.
   ========================================================================== */

function hurtGrandma(amount) {
  state.grandma.hp = ENGINE.clamp(state.grandma.hp - amount, 0, CONFIG.GRANDMA.maxHp);
}

function isGrandmaOutOfHp() {
  return state.grandma.hp <= 0;
}

/* Ticks down the little window of safety she gets right after being hit,
   so one bad moment at the wrong time doesn't drain her whole bar at once. */
function updateGrandmaInvulnerability(dt) {
  if (state.grandma.invulnerable > 0) {
    state.grandma.invulnerable -= dt;
    if (state.grandma.invulnerable < 0) { state.grandma.invulnerable = 0; }
  }
}
