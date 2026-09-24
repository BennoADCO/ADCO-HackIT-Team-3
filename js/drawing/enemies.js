/* ==========================================================================
   DRAWING / ENEMIES.JS  —  THE ENEMY CATS AND THEIR FURBALLS
   ==========================================================================

   What an attacking cat looks like (drawn the same "big head, little
   body" way as everyone else — see drawing/characters.js), plus the
   little grey furballs they throw.
   ========================================================================== */

function drawEnemyCat(enemy) {
  var bob = Math.sin(enemy.bob) * 1.6;

  /* Ordinary alley cats use the sizes in js/config/enemies.js. Big Tony
     carries his own, much bigger ones, from js/config/boss.js. */
  var headSize = enemy.headSize || CONFIG.ENEMY.headSize;
  var bodyWidth = enemy.bodyWidth || CONFIG.ENEMY.bodyWidth;
  var bodyHeight = enemy.bodyHeight || CONFIG.ENEMY.bodyHeight;

  drawVillager({
    emoji: enemy.emoji,
    x: enemy.x,
    y: enemy.y,
    lift: bob,
    headSize: headSize,
    bodyWidth: bodyWidth,
    bodyHeight: bodyHeight,
    bodyColour: enemy.colour,
    trimColour: 'rgba(255, 255, 255, 0.35)',
    tail: true
  });

  if (enemy.isBoss) { drawBossExtras(enemy); }   // his crown

  /* A name tag under its feet, so you can tell the types apart. A big cat
     gets a big tag. */
  var tagWidth = enemy.isBoss ? 92 : 60;
  var tagText = enemy.isBoss ? 13 : 10;
  ENGINE.fillRound(enemy.x - tagWidth / 2, enemy.y + 6, tagWidth, 20, 9,
                   'rgba(255, 250, 240, 0.9)');
  ENGINE.drawText(enemy.name, enemy.x, enemy.y + 16, tagText, CONFIG.COLOURS.ink);

  /* How close it is to giving up (see js/drawing/biscuit.js). The boss
     has the big bar along the top instead. */
  if (!enemy.isBoss) { drawEnemyHealth(enemy); }
}

function drawFurballs() {
  for (var i = 0; i < state.furballs.length; i++) {
    var f = state.furballs[i];

    /* Big Tony's furballs are bigger than everyone else's. */
    var size = f.size || CONFIG.FURBALL_SIZE;

    ENGINE.drawShadow(f.x, f.y + size * 0.4, size * 0.5, size * 0.18);
    ENGINE.ellipse(f.x, f.y, size / 2, size / 2, CONFIG.FURBALL_COLOUR);

    /* A couple of little tufts, so it reads as fluffy rather than a ball. */
    ENGINE.ellipse(f.x - size * 0.28, f.y - size * 0.22, size * 0.16, size * 0.16, CONFIG.FURBALL_DARK);
    ENGINE.ellipse(f.x + size * 0.3, f.y + size * 0.1, size * 0.14, size * 0.14, CONFIG.FURBALL_DARK);
  }
}
