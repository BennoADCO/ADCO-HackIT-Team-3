/* ==========================================================================
   DRAWING / RESULTS.JS  —  END OF DAY, END OF SEASON, GAME OVER
   ==========================================================================

   The full-screen panels: the summary at the end of each day, the end
   of the season (survived all five days), and game over.
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
  var left = 180;
  var right = W - 180;
  panel(left, 110, right - left, 380);

  ENGINE.drawText('🌙  Day ' + state.day + ' Survived!', W / 2, 156, 28, CONFIG.COLOURS.ink);

  var rows = [['🐾 Grooms today', state.dayStats.grooms]];

  /* One line per cat fighting for you — Biscuit, and Big Tony once he's
     changed sides. */
  var friends = fightingCats();
  for (var f = 0; f < friends.length; f++) {
    rows.push(['💚 ' + friends[f].name + "'s health", Math.round(friends[f].health)]);
  }

  rows.push(['💨 Furballs dodged', state.dodged]);
  rows.push(['💥 Hits taken today', state.dayHits]);
  rows.push(['❤️ Grandma’s HP', Math.round(state.grandma.hp) + ' / ' + CONFIG.GRANDMA.maxHp]);

  var y = 210;
  for (var i = 0; i < rows.length; i++) {
    ENGINE.drawText(rows[i][0], left + 52, y, 17, CONFIG.COLOURS.ink, 'left', 'normal');
    ENGINE.drawText(String(rows[i][1]), right - 52, y, 19, CONFIG.COLOURS.ink, 'right');
    y += 32;
  }

  /* Anything to say about Big Tony? */
  var tonyLine = 'A good night’s rest heals everyone up a little before tomorrow’s bigger wave.';
  if (state.tonyRecruited) {
    tonyLine = CONFIG.BOSS_WORDS.joins;
  } else if (state.tonyOutThere) {
    tonyLine = CONFIG.BOSS_WORDS.escaped;
  }
  ENGINE.drawText(tonyLine, W / 2, y + 20, 14, CONFIG.COLOURS.inkSoft, 'center', 'normal');

  pulsingPrompt(CONFIG.TEXT.dayEndPrompt, y + 66);
}

/* Grandma has run out of HP. */
function drawGameOver() {
  dimBackground(0.7);
  var W = CONFIG.CANVAS_WIDTH;
  panel(200, 150, W - 400, 300);

  ENGINE.drawText('💔  GAME OVER  💔', W / 2, 210, 32, '#c0392b');
  ENGINE.drawText(CONFIG.TEXT.gameOverLine, W / 2, 258, 16,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');
  ENGINE.drawText('You made it to day ' + state.day + ' of ' + CONFIG.DAYS_IN_SEASON,
                  W / 2, 300, 18, CONFIG.COLOURS.ink);
  ENGINE.drawText('💨 Furballs dodged: ' + state.dodged, W / 2, 330, 18, CONFIG.COLOURS.ink);

  pulsingPrompt(CONFIG.TEXT.showPrompt, 390);
}

/* The last day is over — survived all five days. */
function drawSeasonEnd() {
  dimBackground(0.68);
  var W = CONFIG.CANVAS_WIDTH;
  panel(190, 110, W - 380, 360);

  var medal = medalFor(state.dodged);

  ENGINE.drawText('🏆  ' + CONFIG.TEXT.seasonEndTitle + '  🏆', W / 2, 156, 26, CONFIG.COLOURS.ink);
  ENGINE.drawText(CONFIG.TEXT.seasonEndLine, W / 2, 184, 14,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');

  var left = 230;
  var y = 232;
  var friends = fightingCats();
  for (var f = 0; f < friends.length; f++) {
    ENGINE.drawText('💚 ' + friends[f].name + "'s health at the end", left, y, 17,
                    CONFIG.COLOURS.ink, 'left', 'normal');
    ENGINE.drawText(String(Math.round(friends[f].health)), W - left, y, 19,
                    CONFIG.COLOURS.ink, 'right');
    y += 32;
  }

  ENGINE.drawText('💨 Total furballs dodged', left, y, 17, CONFIG.COLOURS.ink, 'left', 'normal');
  ENGINE.drawText(String(state.dodged), W - left, y, 19, CONFIG.COLOURS.ink, 'right');
  y += 50;

  ENGINE.drawEmoji(medal.emoji, W / 2 - 110, y + 4, 40);
  ENGINE.drawText(medal.name, W / 2 + 20, y + 4, 22, '#7a4fb8');
  y += 48;

  if (state.beatBest) {
    ENGINE.drawText('✨ A NEW PERSONAL BEST ✨', W / 2, y, 16, '#4f9e52');
  } else {
    ENGINE.drawText('Best ever: ' + state.bestScore, W / 2, y, 15, CONFIG.COLOURS.inkSoft);
  }
  y += 36;

  pulsingPrompt(CONFIG.TEXT.showPrompt, y + 6);
}
