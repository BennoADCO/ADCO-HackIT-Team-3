/* ==========================================================================
   DRAWING / RESULTS.JS  —  END OF DAY, END OF SEASON, GAME OVER
   ==========================================================================

   The full-screen panels: the summary at the end of each day, the
   end of the season, and game over.
   ========================================================================== */

function dimBackground(strength) {
  ctx.fillStyle = 'rgba(40, 30, 22, ' + strength + ')';
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
}

function panel(x, y, w, h) {
  ENGINE.fillRound(x, y, w, h, 24, CONFIG.COLOURS.panelSolid);
  ENGINE.strokeRound(x, y, w, h, 24, CONFIG.COLOURS.panelEdge, 5);
}

/* The "press a key" line that gently pulses. */
function pulsingPrompt(text, y) {
  var pulse = 0.65 + Math.sin(Date.now() / 260) * 0.35;
  ctx.globalAlpha = pulse;
  ENGINE.drawText(text, CONFIG.CANVAS_WIDTH / 2, y, 18, '#4f9e52');
  ctx.globalAlpha = 1;
}

function drawDayEndScreen() {
  dimBackground(0.55);
  var W = CONFIG.CANVAS_WIDTH;
  var left = 220;
  var right = W - 220;
  panel(left, 150, right - left, 300);

  ENGINE.drawText('🌙  End of Day ' + state.day, W / 2, 198, 28, CONFIG.COLOURS.ink);

  var rows = [['🐾 Grooms today', state.dayStats.grooms]];
  var friend = followerCat();
  if (friend) {
    rows.push(['💚 ' + friend.name + "'s health", Math.round(friend.health)]);
  }

  var y = 252;
  for (var i = 0; i < rows.length; i++) {
    ENGINE.drawText(rows[i][0], left + 52, y, 17, CONFIG.COLOURS.ink, 'left', 'normal');
    ENGINE.drawText(String(rows[i][1]), right - 52, y, 19, CONFIG.COLOURS.ink, 'right');
    y += 34;
  }

  ENGINE.drawText(sleepyNote(), W / 2, y + 24, 14, CONFIG.COLOURS.inkSoft, 'center', 'normal');

  pulsingPrompt(CONFIG.TEXT.dayEndPrompt, 414);
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
  ENGINE.drawText('You made it to day ' + state.day + ' of ' + CONFIG.DAYS_IN_SEASON,
                  W / 2, 320, 18, CONFIG.COLOURS.ink);

  pulsingPrompt(CONFIG.TEXT.showPrompt, 390);
}

/* The last day is over. */
function drawSeasonEnd() {
  dimBackground(0.68);
  var W = CONFIG.CANVAS_WIDTH;
  panel(220, 160, W - 440, 280);

  ENGINE.drawText('🏆  ' + CONFIG.TEXT.seasonEndTitle + '  🏆', W / 2, 220, 30, CONFIG.COLOURS.ink);
  ENGINE.drawText(CONFIG.TEXT.seasonEndLine, W / 2, 270, 16,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var friend = followerCat();
  if (friend) {
    ENGINE.drawText('💚 ' + friend.name + "'s health at the end: " + Math.round(friend.health),
                    W / 2, 320, 18, CONFIG.COLOURS.ink);
  }

  pulsingPrompt(CONFIG.TEXT.showPrompt, 390);
}
