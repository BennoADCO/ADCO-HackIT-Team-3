/* ==========================================================================
   RULES / KNOCKOUT.JS  —  WHEN FURBALLS HIT A FRIENDLY CAT
   ==========================================================================

   A furball that reaches a friendly cat hurts it (less if it's wearing
   armour). At zero health the cat is knocked out: it stays where it
   fell and stops swiping, until Grandma grooms it back up.

   All the numbers are in js/config/knockout.js.
   ========================================================================== */

/* Called for every furball, every frame (see js/rules/enemies.js).
   Returns true if the furball hit a cat, so it can be removed. */
function furballHitsCat(furball) {
  var k = CONFIG.KNOCKOUT;
  var reach = k.hitRadius + CONFIG.FURBALL_SIZE / 2;

  for (var i = 0; i < state.cats.length; i++) {
    var cat = state.cats[i];
    if (cat.knockedOut || cat.safeTimer > 0) { continue; }

    /* Cats' x/y is their feet; aim for the middle of the body instead. */
    var gap = ENGINE.distance(furball.x, furball.y, cat.x, cat.y - 20);
    if (gap < reach) {
      hurtCat(cat, furball.damage);
      return true;
    }
  }
  return false;
}

function hurtCat(cat, amount) {
  var k = CONFIG.KNOCKOUT;
  var damage = Math.round(amount * k.damageMultiplier * armourFor(cat).damageTaken);

  cat.health = ENGINE.clamp(cat.health - damage, 0, 100);
  cat.safeTimer = k.safeSeconds;
  addParticle(cat.x, cat.y - 60, '-' + damage + ' 💥', '#e5484d', 18);
  ENGINE.sound('hit');

  if (cat.health <= 0) {
    cat.knockedOut = true;
    cat.lunge = 0;
    say(cat.name + ' ' + k.words.knockedOut);
    ENGINE.sound('deny');
  }
}

/* Counts down each cat's little safe window after a hit. */
function updateCatSafeTimers(dt) {
  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].safeTimer > 0) { state.cats[i].safeTimer -= dt; }
  }
}

/* After a groom (or a heal), a knocked-out cat with enough health gets up. */
function checkCatWakesUp(cat) {
  if (!cat.knockedOut) { return; }
  if (cat.health < CONFIG.KNOCKOUT.wakeUpHealth) { return; }

  cat.knockedOut = false;
  say(cat.name + ' ' + CONFIG.KNOCKOUT.words.wokeUp);
  sparkle(cat.x, cat.y - 20, CONFIG.CAT_HEALTH_BAR_COLOUR);
}

/* A good night's sleep gets everyone back up, however poorly they were. */
function wakeEveryoneOvernight() {
  for (var i = 0; i < state.cats.length; i++) {
    var cat = state.cats[i];
    if (!cat.knockedOut) { continue; }
    cat.knockedOut = false;
    cat.health = Math.max(cat.health, CONFIG.KNOCKOUT.wakeUpHealth);
  }
}
