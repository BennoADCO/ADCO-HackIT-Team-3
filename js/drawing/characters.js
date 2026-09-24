/* ==========================================================================
   DRAWING / CHARACTERS.JS  —  GRANDMA AND THE CATS
   ==========================================================================

   Everybody in this game — Grandma and every cat — is drawn the same
   way: a big round emoji head sitting on a small chunky body that the
   game draws with simple shapes. Big head, little body, soft shadow.

   'x' and 'y' are where the character's FEET are, not the middle.
   ========================================================================== */

function drawVillager(o) {
  var x = o.x;
  var feetY = o.y;
  var bodyW = o.bodyWidth;
  var bodyH = o.bodyHeight;
  var headSize = o.headSize;
  var lift = o.lift || 0;          // a little bounce while walking

  var body = o.bodyColour;
  var dark = ENGINE.shade(body, -34);

  var bottom = feetY - 3 + lift;
  var top = bottom - bodyH;

  // The shadow stays on the ground even when the character bounces.
  ENGINE.drawShadow(x, feetY + 1, bodyW * 0.6, bodyW * 0.2);

  // A tail, for the cats.
  if (o.tail) {
    ctx.beginPath();
    ctx.moveTo(x + bodyW * 0.42, bottom - bodyH * 0.35);
    ctx.quadraticCurveTo(x + bodyW * 1.15, bottom - bodyH * 0.6,
                         x + bodyW * 0.92, top - bodyH * 0.5);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Two stubby legs.
  ENGINE.fillRound(x - bodyW * 0.30 - 4, bottom - 5, 9, 9, 4, dark);
  ENGINE.fillRound(x + bodyW * 0.30 - 5, bottom - 5, 9, 9, 4, dark);

  // Arms, drawn before the body so they tuck in behind it.
  ENGINE.ellipse(x - bodyW * 0.54, top + bodyH * 0.45, 6, 8, dark);
  ENGINE.ellipse(x + bodyW * 0.54, top + bodyH * 0.45, 6, 8, dark);

  // The body itself.
  ENGINE.fillRound(x - bodyW / 2, top, bodyW, bodyH, Math.min(bodyW, bodyH) * 0.45, body);

  // A pale hem along the bottom — Grandma's pinny, or a cat's tummy.
  if (o.trimColour) {
    ENGINE.fillRound(x - bodyW * 0.36, top + bodyH * 0.44, bodyW * 0.72,
                     bodyH * 0.5, bodyH * 0.24, o.trimColour);
  }

  // A soft highlight so the body doesn't look flat.
  ENGINE.ellipse(x - bodyW * 0.2, top + bodyH * 0.26, bodyW * 0.16, bodyH * 0.16,
                 'rgba(255,255,255,0.35)');

  // And the head on top.
  ENGINE.drawEmoji(o.emoji, x, top - headSize * 0.30, headSize);

  return top - headSize * 0.30;   // where the head ended up
}

function drawCatsAndGrandma() {
  /* Sort by how far down the screen things are, so closer things overlap
     further ones. It's a cheap trick that makes it look solid. */
  var everything = [];
  var i;

  for (i = 0; i < state.cats.length; i++) {
    everything.push({ y: state.cats[i].y, cat: state.cats[i] });
  }
  everything.push({ y: state.grandma.y, grandma: true });
  if (isHorseHere()) {
    everything.push({ y: state.horse.y, horse: true });
  }
  everything.sort(function (a, b) { return a.y - b.y; });

  var nearest = (state.screen === 'playing' && !state.action) ? findNearestThing() : null;

  for (i = 0; i < everything.length; i++) {
    if (everything[i].grandma) {
      drawGrandma();
    } else if (everything[i].horse) {
      drawHorse();
    } else {
      drawCat(everything[i].cat, nearest);
    }
  }
}

function drawCat(cat, nearest) {
  var bob = Math.sin(cat.bob) * 1.6;

  var isTarget = (nearest && nearest.kind === 'cat' && nearest.cat === cat);
  var isBeingGroomed = (state.action && state.action.kind === 'groom' &&
                        state.action.target === cat);

  /* A golden ring on the ground shows who Space will groom. */
  if (isTarget || isBeingGroomed) {
    ctx.beginPath();
    ctx.ellipse(cat.x, cat.y + 2, 34, 13, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#f0b429';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  var headY = drawVillager({
    emoji: cat.emoji,
    x: cat.x,
    y: cat.y,
    lift: bob,
    headSize: CONFIG.CAT.headSize,
    bodyWidth: CONFIG.CAT.bodyWidth,
    bodyHeight: CONFIG.CAT.bodyHeight,
    bodyColour: cat.colour,
    trimColour: 'rgba(255, 255, 255, 0.45)',
    tail: true
  });

  /* The personality badge, tucked over its shoulder. */
  ENGINE.drawEmoji(cat.personality.emoji, cat.x + 21, headY + 12, 17);

  /* Biscuit (or any cat following Grandma) wears its health bar above
     its head, like Grandma's HP bar, with just its name underneath. */
  if (cat.followsGrandma) {
    ENGINE.drawEmoji('💚', cat.x - 36, headY - 30, 12);
    ENGINE.drawBar(cat.x - 27, headY - 34, 54, 8, cat.health / 100,
                   CONFIG.CAT_HEALTH_BAR_COLOUR, CONFIG.CAT_HEALTH_BAR_EMPTY);
    if (cat.fluff >= 1) {
      ENGINE.drawEmoji('☁️', cat.x, headY - 54 + Math.sin(cat.bob * 1.6) * 3, 22);
    }
    ENGINE.fillRound(cat.x - 30, cat.y + 6, 60, 18, 8, 'rgba(255, 250, 240, 0.95)');
    ENGINE.strokeRound(cat.x - 30, cat.y + 6, 60, 18, 8, CONFIG.COLOURS.panelEdge, 2);
    ENGINE.drawText(cat.name, cat.x, cat.y + 15, 11, CONFIG.COLOURS.ink);
    return;
  }

  /* A cloud above the head means "ready for a brush". */
  if (cat.fluff >= 1) {
    ENGINE.drawEmoji('☁️', cat.x, headY - 24 + Math.sin(cat.bob * 1.6) * 3, 24);
  }

  /* A little name tag under its feet, with the green health bar built in. */
  ENGINE.fillRound(cat.x - 33, cat.y + 6, 66, 28, 9, 'rgba(255, 250, 240, 0.95)');
  ENGINE.strokeRound(cat.x - 33, cat.y + 6, 66, 28, 9, CONFIG.COLOURS.panelEdge, 2);
  ENGINE.drawText(cat.name, cat.x, cat.y + 15, 11, CONFIG.COLOURS.ink);
  ENGINE.drawBar(cat.x - 24, cat.y + 24, 48, 6, cat.health / 100,
                 CONFIG.CAT_HEALTH_BAR_COLOUR, CONFIG.CAT_HEALTH_BAR_EMPTY);
}

function drawGrandma() {
  var g = CONFIG.GRANDMA;
  var bob = state.grandma.walking ? Math.abs(Math.sin(state.grandma.bob)) * 3 : 0;

  var headY = drawVillager({
    emoji: g.emoji,
    x: state.grandma.x,
    y: state.grandma.y,
    lift: -bob,
    headSize: g.headSize,
    bodyWidth: g.bodyWidth,
    bodyHeight: g.bodyHeight,
    bodyColour: g.bodyColour,
    trimColour: g.trimColour
  });

  /* Her HP bar, always floating just above her head, with a little heart. */
  ENGINE.drawEmoji('❤️', state.grandma.x - 42, headY - 30, 14);
  ENGINE.drawBar(state.grandma.x - 32, headY - 34, 64, 8,
                 state.grandma.hp / g.maxHp, g.hpBarColour, g.hpBarEmpty);

  /* The bar that fills up while she's busy with a job (sits above the HP). */
  if (state.action) {
    var a = state.action;
    ENGINE.drawBar(state.grandma.x - 34, headY - 50, 68, 10,
                   a.elapsed / a.duration, '#f0b429', 'rgba(255,255,255,0.85)');
    ENGINE.drawEmoji('🪡', state.grandma.x + 30, headY + 6, 20);
  }
}

/* The random horse. Drawn just like everybody else: a big emoji head on a
   chunky little body. It does nothing, so there's nothing else to draw. */
function drawHorse() {
  var h = CONFIG.HORSE;
  drawVillager({
    emoji: h.emoji,
    x: state.horse.x,
    y: state.horse.y,
    lift: -horseLift(),
    headSize: h.headSize,
    bodyWidth: h.bodyWidth,
    bodyHeight: h.bodyHeight,
    bodyColour: h.bodyColour,
    tail: true
  });
}
