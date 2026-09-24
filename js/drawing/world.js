/* ==========================================================================
   DRAWING / WORLD.JS  —  THE VILLAGE
   ==========================================================================

   The grass, the plaza, the trees and flowers, the four little shops,
   the floating numbers, and the sunrise-to-sunset tint.
   ========================================================================== */

function drawWorld() {
  drawGrass();
  drawPlaza();
  drawScenery();
  drawStations();
  drawCatsAndGrandma();
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

/* --- The four little shops -----------------------------------------------
   Each one is a cream building with a coloured roof and a sign.
   ------------------------------------------------------------------------ */

function drawStations() {
  var nearest = (state.screen === 'playing' && !state.action) ? findNearestThing() : null;

  for (var i = 0; i < CONFIG.STATIONS.length; i++) {
    var s = CONFIG.STATIONS[i];
    var lit = nearest && nearest.kind === 'station' && nearest.station.key === s.key;

    var wallLeft = s.x - 70;
    var wallTop = s.y - 24;
    var wallWidth = 140;
    var wallHeight = 78;

    ENGINE.drawShadow(s.x, s.y + wallHeight - 22, 74, 13);

    /* The roof, slightly wider than the walls so it overhangs. */
    ENGINE.fillRound(s.x - 80, s.y - 56, 160, 38, 13, s.roof);
    ENGINE.fillRound(s.x - 80, s.y - 30, 160, 14, 7, ENGINE.shade(s.roof, -28));

    /* The walls. */
    ENGINE.fillRound(wallLeft, wallTop, wallWidth, wallHeight, 12, CONFIG.COLOURS.panel);
    ENGINE.strokeRound(wallLeft, wallTop, wallWidth, wallHeight, 12,
                       lit ? '#f0b429' : CONFIG.COLOURS.panelEdge, lit ? 5 : 3);

    /* The sign in the window, then the name plate. */
    ENGINE.drawEmoji(s.emoji, s.x, s.y + 4, CONFIG.STATION_SIZE);
    ENGINE.drawText(s.label, s.x, s.y + 32, 13, CONFIG.COLOURS.ink);
    ENGINE.drawText(s.hint, s.x, s.y + 45, 10, CONFIG.COLOURS.inkSoft, 'center', 'normal');

    /* The shop advertises its keys so nobody has to be told twice. */
    if (s.key === 'shop' && lit) {
      ENGINE.fillRound(s.x - 44, s.y - 82, 88, 22, 11, '#5d4733');
      ENGINE.drawText('press 1 - 4', s.x, s.y - 71, 12, '#ffd24a');
    }
  }
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
