/* ==========================================================================
   DRAWING / GEAR.JS  —  WEAPONS AND ARMOUR
   ==========================================================================

   The drops lying on the ground, the gear each cat is holding and
   wearing, and the "who gets it?" box.
   ========================================================================== */

/* Drops glow and bob gently so they're easy to spot. */
function drawDrops() {
  for (var i = 0; i < state.drops.length; i++) {
    var d = state.drops[i];
    var lift = Math.sin(d.bob) * 4;
    ENGINE.drawShadow(d.x, d.y + 2, 16, 6);
    ENGINE.ellipse(d.x, d.y - 18 + lift, 22, 22, 'rgba(255, 210, 74, 0.35)');
    ENGINE.drawEmoji(CONFIG.GEAR_DROP_EMOJI[d.kind], d.x, d.y - 18 + lift, CONFIG.GEAR_DROP_SIZE);
  }
}

/* Called from drawCat (js/drawing/characters.js) once the cat is drawn.
   headY is where the cat's head ended up. */
function drawCatGear(cat, headY) {
  var armour = armourFor(cat);
  if (armour.emoji) {
    ENGINE.drawEmoji(armour.emoji, cat.x + armour.drawX, headY + armour.drawY, armour.size);
  }

  var weapon = weaponFor(cat);
  if (weapon.emoji) {
    ENGINE.drawEmoji(weapon.emoji, cat.x + weapon.drawX, headY + weapon.drawY, weapon.size);
  }
}

/* The pop-up box asking which cat gets the upgrade. One row per cat,
   showing what it has now and what it will get. */
function drawGearChoice() {
  var choice = state.gearChoice;
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;
  var words = CONFIG.GEAR_WORDS;
  var isWeapon = (choice.kind === 'weapon');
  var list = isWeapon ? CONFIG.WEAPONS : CONFIG.ARMOUR;

  var rows = Math.min(state.cats.length, 9);
  var boxW = 460;
  var boxH = 120 + rows * 40;
  var x = W / 2 - boxW / 2;
  var y = H / 2 - boxH / 2;

  /* Dim the garden behind, so it's clear the game is paused. */
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, 0, W, H);

  ENGINE.fillRound(x, y, boxW, boxH, 18, 'rgba(255, 250, 240, 0.97)');
  ENGINE.strokeRound(x, y, boxW, boxH, 18, CONFIG.COLOURS.panelEdge, 3);

  ENGINE.drawEmoji(CONFIG.GEAR_DROP_EMOJI[choice.kind], W / 2, y + 34, 34);
  ENGINE.drawText(words.choose + ' ' + words[choice.kind] + '?', W / 2, y + 70, 20, CONFIG.COLOURS.ink);

  for (var i = 0; i < rows; i++) {
    var cat = state.cats[i];
    var level = isWeapon ? (cat.weaponLevel || 0) : (cat.armourLevel || 0);
    var now = list[level];
    var next = list[Math.min(level + 1, list.length - 1)];
    var change = (level >= list.length - 1)
      ? now.emoji + ' best already — heals +' + CONFIG.GEAR_MAXED_HEAL
      : (now.emoji || '—') + '  →  ' + next.emoji + ' ' + next.name;

    var rowY = y + 108 + i * 40;
    ENGINE.fillRound(x + 24, rowY - 16, 34, 32, 8, '#f0b429');
    ENGINE.drawText(String(i + 1), x + 41, rowY, 18, '#ffffff');
    ENGINE.drawText(cat.name, x + 72, rowY, 17, CONFIG.COLOURS.ink, 'left');
    ENGINE.drawText(change, x + boxW - 24, rowY, 16, CONFIG.COLOURS.ink, 'right', 'normal');
  }

  ENGINE.drawText(words.pressNumber, W / 2, y + boxH - 18, 13, '#8a7460', 'center', 'normal');
}
