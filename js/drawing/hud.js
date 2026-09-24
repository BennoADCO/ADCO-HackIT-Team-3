/* ==========================================================================
   DRAWING / HUD.JS  —  THE BARS ALONG THE TOP AND BOTTOM
   ==========================================================================

   The top bar shows the day, the clock, Biscuit's health, and the
   furball-dodge score. The bottom bar always tells you what's going on.
   Also the message bubble.
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

  /* One health chip per cat fighting for you — Biscuit, and Big Tony too
     once he's been recruited. */
  var friends = fightingCats();
  for (var i = 0; i < friends.length && i < 2; i++) {
    drawHudChip(friends[i].emoji, Math.round(friends[i].health), 310 + i * 86,
                CONFIG.CAT_HEALTH_BAR_COLOUR);
  }

  drawHudChip('💨', state.dodged, 540, '#bde6ff');
  drawHudChip('😾', state.enemies.length, 650, '#ffb3b3');
  drawHudChip('🏆', state.bestScore, 760, '#ffd24a');

  if (ENGINE.isMuted()) {
    ENGINE.drawText('🔇 muted (M)', W - 30, 90, 12, '#6b5a47', 'right');
  }

  /* Big Tony's great red bar, if he's here (js/drawing/boss.js). */
  drawBossBar();
}

function drawHudChip(emoji, value, x, colour) {
  ENGINE.drawEmoji(emoji, x - 26, 35, 22);
  ENGINE.drawText(String(value), x + 2, 35, 19, colour, 'left');
}

/* The cat trotting along with Grandma (Biscuit), or nothing if there isn't one. */
function followerCat() {
  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].followsGrandma) { return state.cats[i]; }
  }
  return null;
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

  /* Busy? Say who she's grooming — and that furballs don't wait for her. */
  if (state.action) {
    ENGINE.drawText('Grooming ' + state.action.target.name + '...', W / 2, midY, 18, '#ffd24a');
    return;
  }

  /* Low on HP? Say so in red instead of the usual reminder. */
  if (state.grandma.hp <= CONFIG.GRANDMA.maxHp * 0.3) {
    ENGINE.drawEmoji('⚠️', 52, midY, 20);
    ENGINE.drawText('Low HP — watch out!', 76, midY, 17, '#ff9d9d', 'left');
    return;
  }

  var thing = findNearestThing();

  if (thing && thing.kind === 'cat') {
    var cat = thing.cat;
    var tier = healthTierFor(cat);
    ENGINE.drawText('SPACE', 46, midY, 17, '#ffd24a', 'left');
    ENGINE.drawText('Groom ' + cat.name, 118, midY, 18, ink, 'left');
    ENGINE.drawText(cat.personality.emoji + '  ' + cat.personality.name + ' · ' +
                    tier.name + ' · ' + cat.personality.blurb,
                    W - 46, midY, 14, '#d8c8b4', 'right', 'normal');
    return;
  }

  /* Standing in open space: just say what to do next. */
  ENGINE.drawEmoji('👉', 52, midY, 20);
  ENGINE.drawText(nextStepHint(), 76, midY, 17, ink, 'left');
}

/* Works out the single most useful thing to tell the player right now. */
function nextStepHint() {
  /* The boss trumps everything else worth saying. */
  if (bossOnScreen()) { return CONFIG.BOSS_WORDS.hint; }

  var friend = followerCat();
  if (friend && friend.health >= 100) { return CONFIG.TEXT.allWell; }
  if (friend) { return CONFIG.TEXT.needGroom; }
  return CONFIG.TEXT.dodgeHint;
}

function drawMessage() {
  if (state.messageTimer <= 0 || !state.message) { return; }
  var fade = ENGINE.clamp(state.messageTimer / 0.8, 0, 1);

  ctx.globalAlpha = fade;
  ctx.font = 'bold 15px "Trebuchet MS", "Segoe UI", Verdana, sans-serif';
  var width = ctx.measureText(state.message).width + 44;
  var x = CONFIG.CANVAS_WIDTH / 2 - width / 2;

  /* Drop the bubble below the boss's big bar when he's on screen. */
  var y = bossOnScreen() ? 132 : 92;

  ENGINE.fillRound(x, y, width, 34, 17, 'rgba(74, 59, 47, 0.92)');
  ENGINE.drawText(state.message, CONFIG.CANVAS_WIDTH / 2, y + 17, 15, '#fff6e6');
  ctx.globalAlpha = 1;
}
