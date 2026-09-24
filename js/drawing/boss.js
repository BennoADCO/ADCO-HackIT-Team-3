/* ==========================================================================
   DRAWING / BOSS.JS  —  WHAT BIG TONY LOOKS LIKE
   ==========================================================================

   Big Tony is drawn by the normal enemy-cat code in drawing/enemies.js —
   he just carries bigger sizes. This file adds the bits that are only
   his: the crown over his head, and the great red bar across the top of
   the screen showing how close he is to going down.

   All his numbers live in js/config/boss.js.
   ========================================================================== */

/* The crown and the name plate that mark him out as the boss. */
function drawBossExtras(boss) {
  var top = boss.y - boss.bodyHeight - boss.headSize * 0.9;
  ENGINE.drawEmoji(CONFIG.BOSS.crown, boss.x, top - 6, 30);
}

/* The big health bar across the top of the screen, under the HUD.
   It only appears while he's actually in the garden. */
function drawBossBar() {
  var boss = bossOnScreen();
  if (!boss) { return; }

  var bar = CONFIG.BOSS_BAR;
  var x = CONFIG.CANVAS_WIDTH / 2 - bar.width / 2;

  /* How much fight he has left, from 1 (untouched) down to 0. */
  var left = 1 - (boss.damageTaken || 0) / boss.hitsToBeat;
  left = ENGINE.clamp(left, 0, 1);

  /* A dark plate behind it so it reads over the grass. */
  ENGINE.fillRound(x - 10, bar.y - 8, bar.width + 20, bar.height + 30, 12,
                   'rgba(40, 30, 22, 0.72)');

  var colour = (left > 0.5) ? bar.colour : bar.nearlyColour;
  ENGINE.drawBar(x, bar.y, bar.width, bar.height, left, colour, bar.empty);

  ENGINE.drawEmoji(CONFIG.BOSS.emoji, x + 18, bar.y + bar.height / 2, 22);
  ENGINE.drawText(CONFIG.BOSS.name, CONFIG.CANVAS_WIDTH / 2,
                  bar.y + bar.height / 2 + 1, 15, '#fff6e6');

  /* How much more of a beating he needs, spelled out. A bare-pawed swipe
     from Biscuit does 1; weapons and Big Tony do more. */
  var togo = Math.max(0, boss.hitsToBeat - (boss.damageTaken || 0));
  ENGINE.drawText(togo + ' more to go', CONFIG.CANVAS_WIDTH / 2,
                  bar.y + bar.height + 12, 12, '#ffd9a8');
}
