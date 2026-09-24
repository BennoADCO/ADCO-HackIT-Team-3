/* ==========================================================================
   DRAWING / CHARACTERS.JS  —  GRANDMA AND THE ENEMY CATS
   ==========================================================================

   Everybody in this game — Grandma and every enemy cat — is drawn the
   same way: a big round emoji head sitting on a small chunky body that
   the game draws with simple shapes. Big head, little body, soft shadow.
   The enemy cats' own look (and their furballs) is in drawing/enemies.js;
   this file just decides the drawing order and draws Grandma herself.

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

/* Draws Grandma and every enemy cat in one sorted pass, so whoever is
   further down the screen overlaps whoever is further back. Cheap trick,
   makes it look solid. */
function drawCastAndGrandma() {
  var everything = [];
  var i;

  for (i = 0; i < state.enemies.length; i++) {
    everything.push({ y: state.enemies[i].y, enemy: state.enemies[i] });
  }
  everything.push({ y: state.grandma.y, grandma: true });
  everything.sort(function (a, b) { return a.y - b.y; });

  for (i = 0; i < everything.length; i++) {
    if (everything[i].grandma) {
      drawGrandma();
    } else {
      drawEnemyCat(everything[i].enemy);
    }
  }
}

function drawGrandma() {
  var g = CONFIG.GRANDMA;
  var bob = state.grandma.walking ? Math.abs(Math.sin(state.grandma.bob)) * 3 : 0;

  /* While she's briefly safe after a hit, she flickers so it's obvious. */
  var flickering = state.grandma.invulnerable > 0;
  if (flickering) {
    ctx.globalAlpha = 0.45 + Math.sin(Date.now() / 40) * 0.35;
  }

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

  if (flickering) { ctx.globalAlpha = 1; }

  /* Her HP bar, always floating just above her head, with a little heart. */
  ENGINE.drawEmoji('❤️', state.grandma.x - 42, headY - 30, 14);
  ENGINE.drawBar(state.grandma.x - 32, headY - 34, 64, 8,
                 state.grandma.hp / g.maxHp, g.hpBarColour, g.hpBarEmpty);
}
