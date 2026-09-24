/* ==========================================================================
   RULES / BISCUIT.JS  —  BISCUIT FIGHTS BACK
   ==========================================================================

   Every so often, Biscuit swipes at the nearest enemy cat within reach.
   After enough swipes, that enemy gives up and runs off the screen, and
   it's gone for the rest of the day.

   All the numbers are in js/config/biscuit.js.
   ========================================================================== */

/* Biscuit is whichever cat follows Grandma. Returns nothing if there isn't one. */
function findBiscuit() {
  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].followsGrandma) { return state.cats[i]; }
  }
  return null;
}

function updateBiscuitAttacks(dt) {
  var attack = CONFIG.BISCUIT_ATTACK;
  var biscuit = findBiscuit();
  if (!biscuit) { return; }

  /* The "lunge" is how far Biscuit is leaning towards its target right
     now. It shrinks back to nothing after each swipe. */
  if (biscuit.lunge === undefined) { biscuit.lunge = 0; biscuit.swipeTimer = 0; }
  biscuit.lunge = Math.max(0, biscuit.lunge - 90 * dt);
  biscuit.swipeTimer -= dt;

  /* No swiping while Biscuit is busy being groomed, or knocked out. */
  var beingGroomed = state.action && state.action.target === biscuit;
  if (beingGroomed || biscuit.knockedOut || biscuit.swipeTimer > 0) { return; }

  /* Whatever Biscuit is holding changes how hard, how often and how far
     it swipes (see js/config/gear.js). */
  var weapon = weaponFor(biscuit);

  /* Find the nearest enemy close enough to reach. */
  var target = null;
  var targetGap = attack.range + weapon.extraReach;
  for (var i = 0; i < state.enemies.length; i++) {
    var gap = ENGINE.distance(biscuit.x, biscuit.y, state.enemies[i].x, state.enemies[i].y);
    if (gap < targetGap) { target = state.enemies[i]; targetGap = gap; }
  }
  if (!target) { return; }

  /* SWIPE! */
  biscuit.swipeTimer = attack.secondsBetween / weapon.swipeSpeed;
  biscuit.lunge = attack.lungeDistance;
  biscuit.lungeX = (target.x - biscuit.x) / Math.max(targetGap, 1);
  biscuit.lungeY = (target.y - biscuit.y) / Math.max(targetGap, 1);

  target.damageTaken = (target.damageTaken || 0) + weapon.damage;
  state.swipes.push({ x: target.x, y: target.y - 30, life: 0.3, maxLife: 0.3 });
  addParticle(target.x, target.y - 70, CONFIG.BISCUIT_WORDS.swipe, '#e5484d', 20);
  ENGINE.sound('bossHit');

  if (target.damageTaken >= CONFIG.ENEMY_HITS_TO_BEAT) {
    chaseOffEnemy(target);
  }
}

/* The enemy gives up: it leaves the fight and runs straight away from
   Biscuit until it's off the screen. */
function chaseOffEnemy(enemy) {
  var biscuit = findBiscuit();
  var dx = enemy.x - biscuit.x;
  var dy = enemy.y - biscuit.y;
  var gap = Math.sqrt(dx * dx + dy * dy);
  if (gap < 0.01) { dx = 1; dy = 0; gap = 1; }

  enemy.fleeX = dx / gap;
  enemy.fleeY = dy / gap;
  state.enemies.splice(state.enemies.indexOf(enemy), 1);
  state.fleeing.push(enemy);

  sparkle(enemy.x, enemy.y - 30, '#f0b429');
  say(CONFIG.BISCUIT_WORDS.chasedOff + ' ' + enemy.name + '!');
  ENGINE.sound('sell');

  /* It might leave a weapon or armour behind (see js/rules/gear.js). */
  maybeDropGear(enemy.x, enemy.y);

  if (state.enemies.length === 0) {
    say(CONFIG.BISCUIT_WORDS.allGone);
  }
}

/* Beaten cats scarper off the edge of the screen, then vanish. */
function updateFleeingEnemies(dt) {
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;

  for (var i = state.fleeing.length - 1; i >= 0; i--) {
    var e = state.fleeing[i];
    e.x += e.fleeX * CONFIG.ENEMY_FLEE_SPEED * dt;
    e.y += e.fleeY * CONFIG.ENEMY_FLEE_SPEED * dt;
    e.bob += dt * 12;   // legs going like the clappers
    if (e.x < -60 || e.x > W + 60 || e.y < -60 || e.y > H + 60) {
      state.fleeing.splice(i, 1);
    }
  }

  /* The claw marks fade out quickly. */
  for (var j = state.swipes.length - 1; j >= 0; j--) {
    state.swipes[j].life -= dt;
    if (state.swipes[j].life <= 0) { state.swipes.splice(j, 1); }
  }
}
