/* ==========================================================================
   DRAWING / ENEMIES.JS  —  THE ENEMY CATS AND THEIR FURBALLS
   ==========================================================================

   What an attacking cat looks like (drawn the same "big head, little
   body" way as everyone else — see drawing/characters.js), plus the
   little grey furballs they throw.
   ========================================================================== */

function drawEnemyCat(enemy) {
  var bob = Math.sin(enemy.bob) * 1.6;

  drawVillager({
    emoji: enemy.emoji,
    x: enemy.x,
    y: enemy.y,
    lift: bob,
    headSize: CONFIG.ENEMY.headSize,
    bodyWidth: CONFIG.ENEMY.bodyWidth,
    bodyHeight: CONFIG.ENEMY.bodyHeight,
    bodyColour: enemy.colour,
    trimColour: 'rgba(255, 255, 255, 0.35)',
    tail: true
  });

  /* A little name tag under its feet, so you can tell the types apart. */
  ENGINE.fillRound(enemy.x - 30, enemy.y + 6, 60, 18, 9, 'rgba(255, 250, 240, 0.9)');
  ENGINE.drawText(enemy.name, enemy.x, enemy.y + 15, 10, CONFIG.COLOURS.ink);
}

function drawFurballs() {
  var size = CONFIG.FURBALL_SIZE;

  for (var i = 0; i < state.furballs.length; i++) {
    var f = state.furballs[i];

    ENGINE.drawShadow(f.x, f.y + size * 0.4, size * 0.5, size * 0.18);
    ENGINE.ellipse(f.x, f.y, size / 2, size / 2, CONFIG.FURBALL_COLOUR);

    /* A couple of little tufts, so it reads as fluffy rather than a ball. */
    ENGINE.ellipse(f.x - size * 0.28, f.y - size * 0.22, size * 0.16, size * 0.16, CONFIG.FURBALL_DARK);
    ENGINE.ellipse(f.x + size * 0.3, f.y + size * 0.1, size * 0.14, size * 0.14, CONFIG.FURBALL_DARK);
  }
}
