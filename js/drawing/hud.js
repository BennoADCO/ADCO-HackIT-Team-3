/* ==========================================================================
   DRAWING / HUD.JS  —  THE BARS ALONG THE TOP AND BOTTOM
   ==========================================================================

   The top bar shows the day, the clock, and the score. The bottom bar
   always tells you what's going on. Also the message bubble.
   ========================================================================== */

/* ==========================================================================
   THE BAR ALONG THE TOP
   ========================================================================== */

function drawHud() {
  var W = CONFIG.CANVAS_WIDTH;
  ENGINE.fillRound(14, 10, W - 28, 50, 14, CONFIG.COLOURS.hudBar);

  var ink = CONFIG.COLOURS.hudText;

  /* Day counter and the clock. */
  ENGINE.drawText('DAY ' + state.day + ' / ' + CONFIG.DAYS_IN_SEASON, 34, 35, 16, ink, 'left');
  ENGINE.drawBar(132, 29, 132, 12, state.dayTime / CONFIG.DAY_LENGTH_SECONDS,
                 '#ffd24a', 'rgba(0,0,0,0.35)');

  drawHudChip('💨', state.dodged, 420, '#bde6ff');
  drawHudChip('😾', state.enemies.length, 560, '#ffb3b3');
  drawHudChip('🏆', state.bestScore, 700, '#ffd24a');

  if (ENGINE.isMuted()) {
    ENGINE.drawText('🔇 muted (M)', W - 30, 74, 12, '#6b5a47', 'right');
  }
}

function drawHudChip(emoji, value, x, colour) {
  ENGINE.drawEmoji(emoji, x - 26, 35, 22);
  ENGINE.drawText(String(value), x + 2, 35, 19, colour, 'left');
}


/* ==========================================================================
   THE BAR ALONG THE BOTTOM — always tells you what to do next
   ========================================================================== */

function drawBottomBar() {
  var W = CONFIG.CANVAS_WIDTH;
  var y = CONFIG.CANVAS_HEIGHT - 66;
  ENGINE.fillRound(14, y, W - 28, 54, 14, CONFIG.COLOURS.hudBar);

  var midY = y + 27;
  var ink = CONFIG.COLOURS.hudText;

  /* Low on HP? Say so in red instead of the usual reminder. */
  if (state.grandma.hp <= CONFIG.GRANDMA.maxHp * 0.3) {
    ENGINE.drawEmoji('⚠️', 52, midY, 20);
    ENGINE.drawText('Low HP — watch out!', 76, midY, 17, '#ff9d9d', 'left');
    return;
  }

  ENGINE.drawEmoji('👉', 52, midY, 20);
  ENGINE.drawText(CONFIG.TEXT.dodgeHint, 76, midY, 17, ink, 'left');
}

function drawMessage() {
  if (state.messageTimer <= 0 || !state.message) { return; }
  var fade = ENGINE.clamp(state.messageTimer / 0.8, 0, 1);

  ctx.globalAlpha = fade;
  ctx.font = 'bold 15px "Trebuchet MS", "Segoe UI", Verdana, sans-serif';
  var width = ctx.measureText(state.message).width + 44;
  var x = CONFIG.CANVAS_WIDTH / 2 - width / 2;

  ENGINE.fillRound(x, 92, width, 34, 17, 'rgba(74, 59, 47, 0.92)');
  ENGINE.drawText(state.message, CONFIG.CANVAS_WIDTH / 2, 109, 15, '#fff6e6');
  ctx.globalAlpha = 1;
}
