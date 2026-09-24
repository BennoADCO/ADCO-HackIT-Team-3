/* ==========================================================================
   DRAWING / HUD.JS  —  THE BARS ALONG THE TOP AND BOTTOM
   ==========================================================================

   The top bar shows the day, the clock and what you are carrying. The
   bottom bar always tells you what to do next, and turns into the shop
   menu at the Comfort Shop. Also the message bubble.
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

  drawHudChip('🪙', state.coins, 330, CONFIG.COLOURS.coin);
  drawHudChip('☁️', bagTotal(state.fluff), 450, '#ffffff');
  drawHudChip('🧶', bagTotal(state.yarn), 560, '#e9c9a3');
  drawHudChip('🧣', state.products.length, 668, '#9fe3a0');
  drawHudChip('🏆', state.prestige, 800, '#ffd24a');

  /* If you're holding anything magical, show it off just below. */
  drawRarityPips();

  if (ENGINE.isMuted()) {
    ENGINE.drawText('🔇 muted (M)', W - 30, 74, 12, '#6b5a47', 'right');
  }
}

function drawHudChip(emoji, value, x, colour) {
  ENGINE.drawEmoji(emoji, x - 26, 35, 22);
  ENGINE.drawText(String(value), x + 2, 35, 19, colour, 'left');
}

function drawRarityPips() {
  var parts = [];
  for (var i = 1; i < CONFIG.RARITIES.length; i++) {
    var r = CONFIG.RARITIES[i];
    var count = state.fluff[r.key] + state.yarn[r.key];
    if (count > 0) { parts.push({ r: r, count: count }); }
  }
  if (parts.length === 0) { return; }

  /* A dark pill behind them, so the colours stay readable on the grass. */
  var width = parts.length * 58 + 16;
  var startX = 470;
  ENGINE.fillRound(startX - 26, 62, width, 28, 14, 'rgba(74, 59, 47, 0.82)');

  var x = startX;
  for (var n = 0; n < parts.length; n++) {
    ENGINE.drawEmoji(parts[n].r.emoji, x - 8, 76, 16);
    ENGINE.drawText('x' + parts[n].count, x + 4, 77, 14, parts[n].r.colour, 'left');
    x += 58;
  }
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

  /* Busy? Say what she's doing. */
  if (state.action) {
    var names = { groom: 'Grooming', spin: 'Spinning', knit: 'Knitting', sell: 'Selling' };
    var what = names[state.action.kind];
    if (state.action.kind === 'groom') { what += ' ' + state.action.target.name; }
    ENGINE.drawText(what + '...', W / 2, midY, 18, '#ffd24a');
    return;
  }

  var thing = findNearestThing();

  /* At the shop, the bar becomes the shop. */
  if (thing && thing.kind === 'station' && thing.station.key === 'shop') {
    drawShopBar(y);
    return;
  }

  if (thing && thing.kind === 'cat') {
    var cat = thing.cat;
    var tier = healthTierFor(cat);
    if (cat.fluff >= 1) {
      ENGINE.drawText('SPACE', 46, midY, 17, '#ffd24a', 'left');
      ENGINE.drawText('Groom ' + cat.name, 118, midY, 18, ink, 'left');
    } else {
      ENGINE.drawText(cat.name + "'s coat is growing back", 46, midY, 17, '#c9b8a4', 'left');
    }
    ENGINE.drawText(cat.personality.emoji + '  ' + cat.personality.name + ' · ' +
                    tier.name + ' · ' + cat.personality.blurb,
                    W - 46, midY, 14, '#d8c8b4', 'right', 'normal');
    return;
  }

  if (thing && thing.kind === 'station') {
    ENGINE.drawText('SPACE', 46, midY, 17, '#ffd24a', 'left');
    ENGINE.drawText('Use the ' + thing.station.label, 118, midY, 18, ink, 'left');
    ENGINE.drawText(thing.station.hint, W - 46, midY, 14, '#c9b8a4', 'right', 'normal');
    return;
  }

  /* Standing in open space: just say what to do next. */
  ENGINE.drawEmoji('👉', 52, midY, 20);
  ENGINE.drawText(nextStepHint(), 76, midY, 17, ink, 'left');
}

/* Works out the single most useful thing to tell the player right now. */
function nextStepHint() {
  if (state.products.length > 0) { return CONFIG.TEXT.needSell; }
  if (bagTotal(state.yarn) >= CONFIG.YARN_PER_PRODUCT) { return CONFIG.TEXT.needKnit; }
  if (bagTotal(state.fluff) >= CONFIG.FLUFF_PER_YARN) { return CONFIG.TEXT.needSpin; }

  for (var i = 0; i < state.cats.length; i++) {
    if (state.cats[i].fluff >= 1) { return CONFIG.TEXT.needFluff; }
  }

  if (state.coins >= cheapestShopCost()) { return CONFIG.TEXT.needShop; }
  return CONFIG.TEXT.waiting;
}

function drawShopBar(barY) {
  var slotWidth = (CONFIG.CANVAS_WIDTH - 40) / CONFIG.SHOP_ITEMS.length;

  for (var i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
    var item = CONFIG.SHOP_ITEMS[i];
    var owned = (item.key !== 'adopt') && state.upgrades[item.key];
    var cost = (item.key === 'adopt') ? state.adoptCost : item.cost;
    var affordable = state.coins >= cost;

    var left = 20 + i * slotWidth;
    var labelColour = owned ? '#7d9a7d' : (affordable ? '#fff6e6' : '#a89684');
    var costColour = owned ? '#7d9a7d' : (affordable ? '#ffd24a' : '#d08a8a');

    ENGINE.drawText(String(i + 1), left + 16, barY + 20, 16,
                    owned ? '#7d9a7d' : '#ffd24a', 'left');
    ENGINE.drawEmoji(item.emoji, left + 38, barY + 20, 18);
    ENGINE.drawText(item.name, left + 52, barY + 20, 14, labelColour, 'left');
    ENGINE.drawText(owned ? 'installed ✓' : (cost + ' coins'),
                    left + 52, barY + 38, 13, costColour, 'left', 'normal');

    if (i < CONFIG.SHOP_ITEMS.length - 1) {
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.fillRect(left + slotWidth - 4, barY + 10, 1, 34);
    }
  }
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
