/* ==========================================================================
   DRAWING / TUTORIAL.JS  —  WHAT THE (WRONG) TUTORIAL LOOKS LIKE
   ==========================================================================

   A bright 8-bit style stage seen from the side: blue sky, blocky
   towers, a brick floor, Grandma, her Yarn Buster, and Dr. Whiskers.
   The two stripy bars on the left are the old-school health bars.

   All the colours and words live in js/config/tutorial.js.
   ========================================================================== */

var RETRO_FONT = '"Courier New", Consolas, monospace';

function drawTutorial() {
  var T = CONFIG.TUTORIAL;
  var tut = state.tutorial;

  drawTutorialSky(tut.time);
  drawTutorialFloor();
  drawDrWhiskers();
  drawTutorialGran();
  drawYarnBalls();
  drawTutorialSparks();
  drawHealthPips();

  if (tut.time < T.readySeconds) {
    drawReady();
  } else if (tut.finished) {
    drawTutorialComplete();
  } else {
    drawTutorialInstruction();
  }

  if (!tut.finished) {
    drawRetroText(T.quitHint, CONFIG.CANVAS_WIDTH - 90, CONFIG.CANVAS_HEIGHT - 18, 14, T.textColour);
  }
}

/* Chunky capital letters with a thick black outline, like an old cartridge game. */
function drawRetroText(text, x, y, size, colour) {
  ctx.font = 'bold ' + size + 'px ' + RETRO_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, size * 0.2);
  ctx.strokeStyle = '#000000';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = colour;
  ctx.fillText(text, x, y);
}


/* ==========================================================================
   THE STAGE
   ========================================================================== */

function drawTutorialSky(seconds) {
  var T = CONFIG.TUTORIAL;
  var W = CONFIG.CANVAS_WIDTH;
  var i;

  ctx.fillStyle = T.skyColour;
  ctx.fillRect(0, 0, W, CONFIG.CANVAS_HEIGHT);

  /* Clouds drifting slowly left to right, wrapping round at the edge. */
  for (i = 0; i < T.clouds; i++) {
    var x = ((i * 270 + seconds * 14) % (W + 200)) - 100;
    ENGINE.drawEmoji('☁️', x, 150 + (i % 2) * 70, 64);
  }

  /* Blocky towers in the distance, with little square windows. */
  var towerHeights = [150, 230, 180, 270, 200, 160];
  for (i = 0; i < towerHeights.length; i++) {
    var left = i * 155 + 10;
    var top = T.floorY - towerHeights[i];
    ctx.fillStyle = T.towerColour;
    ctx.fillRect(left, top, 90, towerHeights[i]);

    ctx.fillStyle = T.towerWindowColour;
    for (var wy = top + 16; wy < T.floorY - 20; wy += 34) {
      ctx.fillRect(left + 16, wy, 18, 14);
      ctx.fillRect(left + 56, wy, 18, 14);
    }
  }
}

/* Brick blocks, each with a light top-left edge and a dark bottom-right one. */
function drawTutorialFloor() {
  var T = CONFIG.TUTORIAL;
  var size = T.tileSize;
  var edge = 5;

  for (var y = T.floorY; y < CONFIG.CANVAS_HEIGHT; y += size) {
    for (var x = 0; x < CONFIG.CANVAS_WIDTH; x += size) {
      ctx.fillStyle = T.floorColour;
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = T.floorLight;
      ctx.fillRect(x, y, size, edge);
      ctx.fillRect(x, y, edge, size);
      ctx.fillStyle = T.floorDark;
      ctx.fillRect(x, y + size - edge, size, edge);
      ctx.fillRect(x + size - edge, y, edge, size);
    }
  }
}


/* ==========================================================================
   THE CHARACTERS
   ========================================================================== */

function drawTutorialGran() {
  var T = CONFIG.TUTORIAL;
  var G = CONFIG.GRANDMA;
  var tut = state.tutorial;
  var gran = tut.gran;
  var sliding = gran.slideTimer > 0;
  var middleY = T.floorY - gran.height - 45;

  /* A glow around her while the Yarn Buster charges. It flickers once full. */
  if (gran.chargeTime > 0.25) {
    var full = gran.chargeTime >= T.chargeSeconds;
    var flicker = Math.floor(tut.time * 20) % 2;
    ctx.globalAlpha = full ? 0.6 : 0.3;
    ENGINE.ellipse(gran.x, middleY, 50, 60, T.chargeColours[full ? flicker : 0]);
    ctx.globalAlpha = 1;
  }

  var runBob = 0;
  if (gran.running && gran.height === 0) {
    runBob = -Math.abs(Math.sin(tut.time * 14)) * 5;
  }

  /* Squashed flat while sliding. */
  ctx.save();
  ctx.translate(gran.x, T.floorY);
  if (sliding) { ctx.scale(1.35, 0.6); }
  drawVillager({
    emoji: G.emoji, x: 0, y: 0,
    lift: runBob - gran.height,
    headSize: G.headSize, bodyWidth: G.bodyWidth, bodyHeight: G.bodyHeight,
    bodyColour: G.bodyColour, trimColour: G.trimColour
  });
  ctx.restore();

  if (sliding) {
    ENGINE.drawEmoji('💨', gran.x - gran.facing * 55, T.floorY - 14, 28);
  } else {
    /* The Yarn Buster, held out the way she's facing. */
    ENGINE.drawEmoji('🧶', gran.x + gran.facing * 30, T.floorY - gran.height - 30, 18);
  }
}

function drawYarnBalls() {
  var yarn = state.tutorial.yarn;
  for (var i = 0; i < yarn.length; i++) {
    ctx.save();
    ctx.translate(yarn[i].x, yarn[i].y);
    ctx.rotate(yarn[i].spin);
    ENGINE.drawEmoji('🧶', 0, 0, yarn[i].size);
    ctx.restore();
  }
}

function drawDrWhiskers() {
  var T = CONFIG.TUTORIAL;
  var boss = state.tutorial.boss;
  if (!boss || boss.hp <= 0) { return; }

  /* Blinks when he's hit. */
  if (boss.flashTimer > 0 && Math.floor(boss.flashTimer * 30) % 2 === 0) { return; }

  var hop = 0;
  if (boss.landed) { hop = -Math.abs(Math.sin(state.tutorial.time * 3)) * 8; }

  drawVillager({
    emoji: T.bossEmoji, x: boss.x, y: T.floorY,
    lift: hop - boss.height,
    headSize: 84, bodyWidth: 64, bodyHeight: 58,
    bodyColour: T.bossCoat, trimColour: 'rgba(160, 200, 240, 0.7)',
    tail: true
  });
}

function drawTutorialSparks() {
  var sparks = state.tutorial.sparks;
  for (var i = 0; i < sparks.length; i++) {
    ENGINE.ellipse(sparks[i].x, sparks[i].y, 10, 10, CONFIG.TUTORIAL.praiseColour);
    ENGINE.ellipse(sparks[i].x, sparks[i].y, 4, 4, '#ffffff');
  }
}

/* The old-school stripy health bars down the left: Grandma's, then the boss's. */
function drawHealthPips() {
  var T = CONFIG.TUTORIAL;
  var boss = state.tutorial.boss;

  drawPipBar(24, 1, T.granBarColour);
  if (boss && boss.hp > 0) {
    drawPipBar(48, boss.hp / T.bossHp, T.bossBarColour);
  }
}

function drawPipBar(x, fraction, colour) {
  var pips = 20;
  var pipHeight = 5;
  var gap = 2;
  var top = 32;
  var filled = Math.round(fraction * pips);

  ctx.fillStyle = CONFIG.TUTORIAL.barBack;
  ctx.fillRect(x - 3, top - 3, 18, pips * (pipHeight + gap) + 4);

  for (var i = 0; i < filled; i++) {
    var y = top + (pips - 1 - i) * (pipHeight + gap);
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, 12, pipHeight);
  }
}


/* ==========================================================================
   THE WORDS ON TOP
   ========================================================================== */

function drawReady() {
  var T = CONFIG.TUTORIAL;
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;

  drawRetroText(T.stageName, W / 2, H / 2 - 70, 30, T.textColour);
  if (Math.floor(state.tutorial.time * 4) % 2 === 0) {
    drawRetroText(T.readyText, W / 2, H / 2 - 10, 52, T.praiseColour);
  }
}

function drawTutorialInstruction() {
  var T = CONFIG.TUTORIAL;
  var tut = state.tutorial;
  var step = currentTutorialStep();
  var W = CONFIG.CANVAS_WIDTH;

  ENGINE.fillRound(100, 26, 700, 92, 8, 'rgba(0, 0, 0, 0.78)');
  ENGINE.strokeRound(100, 26, 700, 92, 8, '#ffffff', 3);

  if (tut.praiseTimer > 0) {
    drawRetroText(tut.praiseText, W / 2, 72, 34, T.praiseColour);
    return;
  }

  if (step) {
    drawRetroText(step.text, W / 2, 60, 26, T.textColour);
    ENGINE.drawText(step.tip, W / 2, 96, 16, '#d8d8d8', 'center', 'normal');
  }
}

function drawTutorialComplete() {
  var T = CONFIG.TUTORIAL;
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;
  var t = state.tutorial.finishedTime;

  /* Fade the stage down, then bring the words up. */
  ctx.globalAlpha = ENGINE.clamp(t, 0, 1) * 0.65;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;

  if (t < 0.6) { return; }

  drawRetroText(T.completeTitle, W / 2, H / 2 - 70, 48, T.praiseColour);
  drawRetroText(T.completeLine, W / 2, H / 2 - 10, 24, T.textColour);

  if (t >= T.completeDelaySeconds && Math.floor(t * 2.5) % 2 === 0) {
    drawRetroText(T.completePrompt, W / 2, H / 2 + 60, 20, T.textColour);
  }
}
