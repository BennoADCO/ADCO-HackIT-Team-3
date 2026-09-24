/* ==========================================================================
   DRAWING / WORLD.JS  —  THE GARDEN
   ==========================================================================

   The grass, the plaza, the trees and flowers, the floating numbers, and
   the sunrise-to-sunset tint.
   ========================================================================== */

function drawWorld() {
  drawGrass();
  drawPlaza();
  drawScenery();
  drawCastAndGrandma();
  drawFleeingEnemies();   // beaten cats running off (js/drawing/biscuit.js)
  drawSwipes();           // Biscuit's claw marks
  drawFurballs();
  drawParticles();
  drawDayTint();
}

/* --- The ground ----------------------------------------------------------
   Drawn as a soft checkerboard of two greens, the way a village life-sim
   does it, with a scattering of grass tufts on top for texture.
   ------------------------------------------------------------------------ */

var grassTufts = null;   /* worked out once, then reused every frame */

function drawGrass() {
  var tile = CONFIG.GRASS.tile;
  var acrossCount = Math.ceil(CONFIG.CANVAS_WIDTH / tile);
  var downCount = Math.ceil(CONFIG.CANVAS_HEIGHT / tile);

  ctx.fillStyle = CONFIG.COLOURS.grassLight;
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  ctx.fillStyle = CONFIG.COLOURS.grassDark;
  for (var down = 0; down < downCount; down++) {
    for (var across = 0; across < acrossCount; across++) {
      if ((across + down) % 2 === 0) { continue; }
      ctx.fillRect(across * tile, down * tile, tile, tile);
    }
  }

  /* Pick the tuft positions the first time, then keep them still. */
  if (!grassTufts) {
    grassTufts = [];
    for (var n = 0; n < CONFIG.GRASS.tuftCount; n++) {
      grassTufts.push({
        x: ENGINE.randomBetween(0, CONFIG.CANVAS_WIDTH),
        y: ENGINE.randomBetween(0, CONFIG.CANVAS_HEIGHT),
        lean: ENGINE.randomBetween(-2.5, 2.5)
      });
    }
  }

  ctx.strokeStyle = CONFIG.GRASS.tuftColour;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (var t = 0; t < grassTufts.length; t++) {
    var tuft = grassTufts[t];
    ctx.beginPath();
    ctx.moveTo(tuft.x, tuft.y);
    ctx.lineTo(tuft.x + tuft.lean, tuft.y - 5);
    ctx.stroke();
  }
}

/* The paved square in the middle, where the cats live. */
function drawPlaza() {
  var p = CONFIG.PLAZA;
  ENGINE.drawShadow(p.x + p.w / 2, p.y + p.h + 4, p.w / 2.1, 10);
  ENGINE.fillRound(p.x, p.y, p.w, p.h, 54, CONFIG.COLOURS.plaza);
  ENGINE.strokeRound(p.x, p.y, p.w, p.h, 54, CONFIG.COLOURS.plazaEdge, 6);
  ENGINE.strokeRound(p.x + 16, p.y + 16, p.w - 32, p.h - 32, 42,
                     'rgba(224, 200, 148, 0.55)', 2);
}

function drawScenery() {
  var i;

  for (i = 0; i < CONFIG.FLOWERS.length; i++) {
    drawFlower(CONFIG.FLOWERS[i].x, CONFIG.FLOWERS[i].y, CONFIG.FLOWERS[i].colour);
  }

  for (i = 0; i < CONFIG.TREES.length; i++) {
    var tree = CONFIG.TREES[i];
    drawTree(tree.x, tree.y, tree.size, CONFIG.COLOURS);
  }

  for (i = 0; i < CONFIG.DECORATIONS.length; i++) {
    var d = CONFIG.DECORATIONS[i];
    ENGINE.drawEmoji(d.emoji, d.x, d.y, d.size);
  }
}

// A round village tree: a trunk with a bobbly green top.
function drawTree(x, baseY, size, colours) {
  var s = size;
  ENGINE.drawShadow(x, baseY + 2, 30 * s, 10 * s);

  ENGINE.fillRound(x - 7 * s, baseY - 34 * s, 14 * s, 34 * s, 5 * s, colours.treeTrunk);

  ENGINE.ellipse(x, baseY - 46 * s, 30 * s, 26 * s, colours.treeLeafLow);
  ENGINE.ellipse(x - 14 * s, baseY - 52 * s, 20 * s, 18 * s, colours.treeLeafTop);
  ENGINE.ellipse(x + 13 * s, baseY - 54 * s, 19 * s, 17 * s, colours.treeLeafTop);
  ENGINE.ellipse(x, baseY - 64 * s, 21 * s, 19 * s, colours.treeLeafTop);
}

// A simple five-petal flower.
function drawFlower(x, y, colour) {
  var i;
  for (i = 0; i < 5; i++) {
    var angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    ENGINE.ellipse(x + Math.cos(angle) * 5, y + Math.sin(angle) * 5, 4, 4, colour);
  }
  ENGINE.ellipse(x, y, 2.6, 2.6, '#fff4c2');
}

function drawParticles() {
  for (var i = 0; i < state.particles.length; i++) {
    var p = state.particles[i];
    var fade = ENGINE.clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = fade;
    ENGINE.drawText(p.text, p.x, p.y, p.size, p.colour);
    ctx.globalAlpha = 1;
  }
}

/* A gentle wash of colour that shifts from morning to evening. */
function drawDayTint() {
  if (state.screen === 'title') { return; }
  var through = state.dayTime / CONFIG.DAY_LENGTH_SECONDS;
  var stops = CONFIG.DAY_TINT;

  var chosen = stops[0].colour;
  for (var i = 0; i < stops.length; i++) {
    if (through >= stops[i].at) { chosen = stops[i].colour; }
  }
  ctx.fillStyle = chosen;
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
}
