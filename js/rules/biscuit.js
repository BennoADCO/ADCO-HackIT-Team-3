/* ==========================================================================
   RULES / BISCUIT.JS  —  BISCUIT FIGHTS BACK
   ==========================================================================

   Every so often, Biscuit swipes at the nearest enemy cat within reach.
   After enough swipes, that enemy gives up and runs off the screen, and
   it's gone for the rest of the day.

   All the numbers are in js/config/biscuit.js.
   ========================================================================== */

/* Every cat trotting along with Grandma is a fighter. That's Biscuit to
   start with, and Big Tony too once he's been recruited. */
function fightingCats() {
  var fighters = [];
  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].followsGrandma) { fighters.push(state.cats[i]); }
  }
  return fighters;
}

/* Biscuit is the first cat following Grandma. Nothing if there isn't one. */
function findBiscuit() {
  var fighters = fightingCats();
  return fighters.length > 0 ? fighters[0] : null;
}

function updateBiscuitAttacks(dt) {
  var fighters = fightingCats();
  for (var i = 0; i < fighters.length; i++) {
    updateOneFighter(fighters[i], dt);
  }
}

/* One cat looking for something to swipe at. Biscuit uses the numbers in
   js/config/biscuit.js; Big Tony carries his own from js/config/boss.js. */
function updateOneFighter(fighter, dt) {
  var attack = fighter.attack || CONFIG.BISCUIT_ATTACK;

  /* The "lunge" is how far this cat is leaning towards its target right
     now. It shrinks back to nothing after each swipe. */
  if (fighter.lunge === undefined) { fighter.lunge = 0; fighter.swipeTimer = 0; }
  fighter.lunge = Math.max(0, fighter.lunge - 90 * dt);
  fighter.swipeTimer -= dt;

  /* No swiping while it's busy being groomed, or knocked out. */
  var beingGroomed = state.action && state.action.target === fighter;
  if (beingGroomed || fighter.knockedOut || fighter.swipeTimer > 0) { return; }

  /* Whatever this cat is holding changes how hard, how often and how far
     it swipes (see js/config/gear.js). */
  var weapon = weaponFor(fighter);

  /* Find the nearest enemy close enough to reach. */
  var target = null;
  var targetGap = attack.range + weapon.extraReach;
  for (var i = 0; i < state.enemies.length; i++) {
    var gap = ENGINE.distance(fighter.x, fighter.y, state.enemies[i].x, state.enemies[i].y);
    if (gap < targetGap) { target = state.enemies[i]; targetGap = gap; }
  }
  if (!target) { return; }

  /* SWIPE! */
  fighter.swipeTimer = attack.secondsBetween / weapon.swipeSpeed;
  fighter.lunge = attack.lungeDistance;
  fighter.lungeX = (target.x - fighter.x) / Math.max(targetGap, 1);
  fighter.lungeY = (target.y - fighter.y) / Math.max(targetGap, 1);

  /* Tony's swipes land twice as hard as anyone else's, on top of whatever
     he's holding — see 'hitsPerSwipe' in js/config/boss.js. */
  var power = attack.hitsPerSwipe || 1;
  target.damageTaken = (target.damageTaken || 0) + weapon.damage * power;

  state.swipes.push({ x: target.x, y: target.y - 30, life: 0.3, maxLife: 0.3,
                      colour: attack.slashColour });
  addParticle(target.x, target.y - 70, CONFIG.BISCUIT_WORDS.swipe, '#e5484d', 20);
  ENGINE.sound('bossHit');

  /* Big Tony takes far more knocking down than an ordinary alley cat. */
  var needed = target.hitsToBeat || CONFIG.ENEMY_HITS_TO_BEAT;

  if (target.damageTaken >= needed) {
    if (target.isBoss) {
      recruitBigTony(target);   // he changes sides instead of running off
    } else {
      chaseOffEnemy(target, fighter);
    }
  } else if (target.isBoss) {
    checkBossWobble(target);
  }
}

/* The enemy gives up: it leaves the fight and runs straight away from
   whichever cat saw it off, until it's off the screen. */
function chaseOffEnemy(enemy, attacker) {
  var biscuit = attacker || findBiscuit();
  var dx = enemy.x - biscuit.x;
  var dy = enemy.y - biscuit.y;
  var gap = Math.sqrt(dx * dx + dy * dy);
  if (gap < 0.01) { dx = 1; dy = 0; gap = 1; }

  enemy.fleeX = dx / gap;
  enemy.fleeY = dy / gap;
  state.enemies.splice(state.enemies.indexOf(enemy), 1);
  state.fleeing.push(enemy);

  sparkle(enemy.x, enemy.y - 30, '#f0b429');
  say('💨 ' + biscuit.name + ' ' + CONFIG.BISCUIT_WORDS.chasedOff + ' ' + enemy.name + '!');
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
