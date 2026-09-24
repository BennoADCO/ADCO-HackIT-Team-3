/* ==========================================================================
   DRAWING / RESULTS.JS  —  END OF DAY, GAME OVER, AND THE VICTORY SCREEN
   ==========================================================================

   The full-screen panels: the summary at the end of each day, Grandma
   running out of HP, and surviving all five days.
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
  panel(left, 130, right - left, 340);

  ENGINE.drawText('🌙  Day ' + state.day + ' Survived!', W / 2, 178, 28, CONFIG.COLOURS.ink);

  var rows = [
    ['💨 Furballs dodged', state.dodged],
    ['💥 Hits taken today', state.dayHits],
    ['❤️ HP remaining', Math.round(state.grandma.hp) + ' / ' + CONFIG.GRANDMA.maxHp]
  ];

  var y = 234;
  for (var i = 0; i < rows.length; i++) {
    ENGINE.drawText(rows[i][0], left + 52, y, 17, CONFIG.COLOURS.ink, 'left', 'normal');
    ENGINE.drawText(String(rows[i][1]), right - 52, y, 19, CONFIG.COLOURS.ink, 'right');
    y += 36;
  }

  ENGINE.drawText('A good night’s rest heals her up a little before tomorrow’s bigger wave.',
                  W / 2, y + 20, 14, CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.dayEndPrompt, W / 2, 440, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}

/* Grandma has run out of HP. */
function drawGameOver() {
  dimBackground(0.7);
  var W = CONFIG.CANVAS_WIDTH;
  panel(200, 150, W - 400, 300);

  ENGINE.drawText('💔  GAME OVER  💔', W / 2, 210, 32, '#c0392b');
  ENGINE.drawText(CONFIG.TEXT.gameOverLine, W / 2, 258, 16,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');
  ENGINE.drawText('Made it to Day ' + state.day, W / 2, 300, 18, CONFIG.COLOURS.ink);
  ENGINE.drawText('💨 Furballs dodged: ' + state.dodged, W / 2, 330, 18, CONFIG.COLOURS.ink);

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.showPrompt, W / 2, 400, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}

/* Survived all five days. */
function drawVictoryScreen() {
  dimBackground(0.68);
  var W = CONFIG.CANVAS_WIDTH;
  panel(190, 120, W - 380, 340);

  var medal = medalFor(state.dodged);

  ENGINE.drawText('🏆  YOU SURVIVED THE GARDEN!  🏆', W / 2, 168, 24, CONFIG.COLOURS.ink);
  ENGINE.drawText('Five days of furballs, and Grandma is still standing.',
                  W / 2, 196, 14, CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var y = 250;
  ENGINE.drawText('💨 Total furballs dodged', 240, y, 18, CONFIG.COLOURS.ink, 'left');
  ENGINE.drawText(String(state.dodged), W - 240, y, 26, '#a06a2c', 'right');
  y += 60;

  ENGINE.drawEmoji(medal.emoji, W / 2 - 110, y + 4, 40);
  ENGINE.drawText(medal.name, W / 2 + 20, y + 4, 22, '#7a4fb8');
  y += 50;

  if (state.beatBest) {
    ENGINE.drawText('✨ A NEW PERSONAL BEST ✨', W / 2, y, 16, '#4f9e52');
  } else {
    ENGINE.drawText('Best ever: ' + state.bestScore, W / 2, y, 15, CONFIG.COLOURS.inkSoft);
  }
  y += 40;

  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(CONFIG.TEXT.showPrompt, W / 2, y + 6, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}
