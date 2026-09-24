/* ==========================================================================
   DRAWING / RESULTS.JS  —  END OF DAY AND THE FASHION SHOW
   ==========================================================================

   The two full-screen panels: the summary at the end of each day, and
   the Fashion Show results at the end of the season.
   ========================================================================== */

function dimBackground(strength) {
  ctx.fillStyle = 'rgba(40, 30, 22, ' + strength + ')';
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
}

function panel(x, y, w, h) {
  ENGINE.fillRound(x, y, w, h, 24, CONFIG.COLOURS.panelSolid);
  ENGINE.strokeRound(x, y, w, h, 24, CONFIG.COLOURS.panelEdge, 5);
}

function drawDayEndScreen() {
  dimBackground(0.55);
  var W = CONFIG.CANVAS_WIDTH;
  var left = 180;
  var right = W - 180;
  panel(left, 92, right - left, 416);

  var s = state.dayStats;
  ENGINE.drawText('🌙  End of Day ' + state.day, W / 2, 140, 28, CONFIG.COLOURS.ink);

  var rows = [
    ['☁️ Fluff collected', s.fluff],
    ['🧶 Yarn spun', s.yarn],
    ['🧣 Pieces knitted', s.products],
    ['🪙 Coins earned', s.coins],
    ['✨ Magical fur', s.rares]
  ];

  var y = 194;
  for (var i = 0; i < rows.length; i++) {
    ENGINE.drawText(rows[i][0], left + 52, y, 17, CONFIG.COLOURS.ink, 'left', 'normal');
    ENGINE.drawText(String(rows[i][1]), right - 52, y, 19, CONFIG.COLOURS.ink, 'right');
    y += 32;
  }

  ctx.fillStyle = CONFIG.COLOURS.panelEdge;
  ctx.fillRect(left + 52, y - 4, (right - left) - 104, 2);

  ENGINE.drawText('🏆 Fashion Show total so far', left + 52, y + 26, 17,
                  CONFIG.COLOURS.ink, 'left');
  ENGINE.drawText(String(state.prestige), right - 52, y + 26, 24, '#a06a2c', 'right');

  ENGINE.drawText(sleepyNote(), W / 2, y + 68, 14, CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.dayEndPrompt, W / 2, 470, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}

/* A friendly nudge about whichever cat is having the worst time of it.
   Kept short so it always fits inside the panel. */
function sleepyNote() {
  var saddest = null;
  for (var i = 0; i < state.cats.length; i++) {
    if (!saddest || state.cats[i].health < saddest.health) { saddest = state.cats[i]; }
  }
  if (!saddest) { return 'The sanctuary is very quiet tonight.'; }
  if (saddest.health > 60) { return 'Everybody sleeps soundly. The coats look splendid.'; }
  return saddest.emoji + ' ' + saddest.name + ' is feeling poorly. Brush them first tomorrow?';
}

/* Grandma has run out of HP. */
function drawGameOver() {
  dimBackground(0.7);
  var W = CONFIG.CANVAS_WIDTH;
  panel(220, 160, W - 440, 280);

  ENGINE.drawText('💔  GAME OVER  💔', W / 2, 220, 32, '#c0392b');
  ENGINE.drawText(CONFIG.TEXT.gameOverLine, W / 2, 270, 16,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');
  ENGINE.drawText('🏆 Fashion Show points: ' + state.prestige, W / 2, 320, 18,
                  CONFIG.COLOURS.ink);

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.showPrompt, W / 2, 390, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}

function drawFashionShow() {
  dimBackground(0.68);
  var W = CONFIG.CANVAS_WIDTH;
  panel(150, 58, W - 300, 486);

  var medal = medalFor(state.prestige);

  ENGINE.drawText('🏆  THE FASHION SHOW  🏆', W / 2, 104, 26, CONFIG.COLOURS.ink);
  ENGINE.drawText('Grandma presents her finest work', W / 2, 130, 14,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var y = 172;
  if (state.showcase.length === 0) {
    ENGINE.drawText('Nothing was finished in time. The cats are baffled.',
                    W / 2, y + 20, 16, CONFIG.COLOURS.inkSoft, 'center', 'normal');
    y += 80;
  } else {
    for (var i = 0; i < state.showcase.length; i++) {
      var item = state.showcase[i];
      ENGINE.drawEmoji(item.emoji, 216, y, 24);
      ENGINE.drawEmoji(item.rarity.emoji, 244, y, 18);
      ENGINE.drawText(item.rarity.name + ' ' + item.name, 266, y, 17,
                      CONFIG.COLOURS.ink, 'left');
      ENGINE.drawText(String(item.value), W - 216, y, 18, item.rarity.colour, 'right');
      y += 32;
    }
    y += 10;
  }

  ctx.fillStyle = CONFIG.COLOURS.panelEdge;
  ctx.fillRect(216, y, W - 432, 2);
  y += 30;

  ENGINE.drawText('Season total', 216, y, 18, CONFIG.COLOURS.ink, 'left');
  ENGINE.drawText(String(state.prestige), W - 216, y, 30, '#a06a2c', 'right');
  y += 46;

  ENGINE.drawEmoji(medal.emoji, W / 2 - 130, y + 4, 40);
  ENGINE.drawText(medal.name, W / 2 + 22, y + 4, 26, '#7a4fb8');
  y += 46;

  if (state.beatBest) {
    ENGINE.drawText('✨ A NEW PERSONAL BEST ✨', W / 2, y, 16, '#4f9e52');
  } else {
    ENGINE.drawText('Best ever: ' + state.bestScore, W / 2, y, 15, CONFIG.COLOURS.inkSoft);
  }
  y += 34;

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.showPrompt, W / 2, y + 6, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}
