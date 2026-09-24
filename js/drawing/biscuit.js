/* ==========================================================================
   DRAWING / BISCUIT.JS  —  BISCUIT FIGHTS BACK
   ==========================================================================

   The claw marks when Biscuit swipes, the little red bar over each enemy
   showing how close it is to giving up, and the beaten cats running away.
   ========================================================================== */

/* A small red bar over an enemy's head. Only shows once it's been hit. */
function drawEnemyHealth(enemy) {
  var hurt = enemy.damageTaken || 0;
  if (hurt === 0) { return; }
  var left = 1 - hurt / CONFIG.ENEMY_HITS_TO_BEAT;
  ENGINE.drawBar(enemy.x - 22, enemy.y - 82, 44, 6, left,
                 CONFIG.ENEMY_HEALTH_BAR_COLOUR, CONFIG.ENEMY_HEALTH_BAR_EMPTY);
}

/* Three quick white scratch lines across the enemy, fading fast. */
function drawSwipes() {
  for (var i = 0; i < state.swipes.length; i++) {
    var s = state.swipes[i];
    ctx.globalAlpha = s.life / s.maxLife;
    ctx.strokeStyle = CONFIG.BISCUIT_ATTACK.slashColour;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (var k = -1; k <= 1; k++) {
      ctx.beginPath();
      ctx.moveTo(s.x - 18 + k * 10, s.y - 18);
      ctx.lineTo(s.x + 18 + k * 10, s.y + 18);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

/* Beaten cats running off, with a puff of dust behind them. */
function drawFleeingEnemies() {
  for (var i = 0; i < state.fleeing.length; i++) {
    var e = state.fleeing[i];
    drawEnemyCat(e);
    ENGINE.drawEmoji('💨', e.x - e.fleeX * 40, e.y - 20 - e.fleeY * 40, 26);
  }
}
