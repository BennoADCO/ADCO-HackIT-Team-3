/* ==========================================================================
   DRAWING / TITLE.JS  —  THE WELCOME SCREEN
   ==========================================================================

   The first thing anybody sees, so it does a lot of work: it names the
   game, shows the characters, explains the whole loop in four words, and
   gives one obvious button to press — plus a quieter Tutorial button
   beside it, which opens the (completely wrong) tutorial.
   ========================================================================== */

var titleFloaters = null;

/* Where the two buttons sit, in game dots. Clicks are checked against
   these boxes too, so moving a button here moves where you click it. */
var TITLE_PLAY_BUTTON = { centreX: 350, centreY: 438, width: 290, height: 54 };
var TITLE_TUTORIAL_BUTTON = { centreX: 612, centreY: 438, width: 190, height: 54 };

function wasButtonClicked(button) {
  return ENGINE.wasClickedInside(button.centreX - button.width / 2,
                                 button.centreY - button.height / 2,
                                 button.width, button.height);
}

function drawTitleScreen() {
  var W = CONFIG.CANVAS_WIDTH;
  var T = CONFIG.TITLE;
  var seconds = Date.now() / 1000;

  /* The village carries on behind, softly blurred out by a dark vignette. */
  drawGrass();
  drawPlaza();
  drawScenery();
  drawVignette();
  drawTitleFloaters(seconds);

  /* --- The card ----------------------------------------------------- */
  var cardX = 130, cardY = 76, cardW = 640, cardH = 456;

  ENGINE.fillRound(cardX + 6, cardY + 14, cardW, cardH, 34, 'rgba(45, 32, 20, 0.35)');
  ENGINE.fillRound(cardX, cardY, cardW, cardH, 34, CONFIG.COLOURS.panelSolid);
  ENGINE.strokeRound(cardX, cardY, cardW, cardH, 34, '#ffffff', 7);
  ENGINE.strokeRound(cardX, cardY, cardW, cardH, 34, CONFIG.COLOURS.panelEdge, 2);

  drawBunting(cardX + 34, cardX + cardW - 34, cardY + 6);

  /* --- The cast, bobbing gently -------------------------------------- */
  var bob = Math.sin(seconds * 2.4) * 3;
  drawTitleCat(CONFIG.STARTING_CATS[0], 344, 214, bob);
  drawTitleCat(CONFIG.ENEMY_TYPES[0], 556, 214, -bob);

  drawVillager({
    emoji: CONFIG.GRANDMA.emoji, x: 450, y: 222,
    lift: -Math.abs(Math.sin(seconds * 2.4)) * 4,
    headSize: 58, bodyWidth: 46, bodyHeight: 44,
    bodyColour: CONFIG.GRANDMA.bodyColour, trimColour: CONFIG.GRANDMA.trimColour
  });

  /* --- The name ------------------------------------------------------ */
  ENGINE.drawStickerText(CONFIG.GAME_TITLE, W / 2, 278, 46,
                         T.inkFill, T.inkOutline, T.inkShadow);
  ENGINE.drawText(CONFIG.GAME_SUBTITLE, W / 2, 312, 16,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');

  /* --- The whole game, in four pills ----------------------------------- */
  drawLoopChips(W / 2, 356);

  /* --- The hook ------------------------------------------------------ */
  ENGINE.drawText(CONFIG.TEXT.titleHook,
                  W / 2, 392, 15, CONFIG.COLOURS.ink, 'center', 'normal');

  /* --- The buttons -------------------------------------------------- */
  drawStartButton(seconds);
  drawTutorialButton();

  /* --- The small print ----------------------------------------------- */
  if (state.bestScore > 0) {
    ENGINE.fillRound(W / 2 - 100, 470, 200, 26, 13, '#fbeed2');
    ENGINE.drawEmoji('💨', W / 2 - 70, 483, 15);
    ENGINE.drawText('Best dodges  ' + state.bestScore, W / 2 + 16, 484, 14, '#a06a2c');
  }

  ENGINE.drawText(CONFIG.TEXT.controls, W / 2, 512, 13,
                  CONFIG.COLOURS.inkSoft, 'center', 'normal');
}

/* Emoji drifting slowly up the background, like bubbles. */
function drawTitleFloaters(seconds) {
  var T = CONFIG.TITLE;

  if (!titleFloaters) {
    titleFloaters = [];
    for (var n = 0; n < T.floaterCount; n++) {
      titleFloaters.push({
        emoji: ENGINE.randomFrom(T.floaters),
        x: ENGINE.randomBetween(20, CONFIG.CANVAS_WIDTH - 20),
        offset: ENGINE.randomBetween(0, 700),
        size: ENGINE.randomBetween(18, 34),
        speed: ENGINE.randomBetween(14, 30),
        sway: ENGINE.randomBetween(0, 6)
      });
    }
  }

  for (var i = 0; i < titleFloaters.length; i++) {
    var f = titleFloaters[i];

    /* Drift upwards and wrap around to the bottom again. */
    var travelled = f.offset + seconds * f.speed;
    var y = CONFIG.CANVAS_HEIGHT + 40 - (travelled % (CONFIG.CANVAS_HEIGHT + 80));
    var x = f.x + Math.sin(seconds * 0.7 + f.sway) * 16;

    ctx.globalAlpha = 0.85;
    ENGINE.drawEmoji(f.emoji, x, y, f.size);
    ctx.globalAlpha = 1;
  }
}

/* A dark edge all the way round, so the card in the middle pops forward. */
function drawVignette() {
  var W = CONFIG.CANVAS_WIDTH;
  var H = CONFIG.CANVAS_HEIGHT;
  var glow = ctx.createRadialGradient(W / 2, H / 2, 140, W / 2, H / 2, 560);
  glow.addColorStop(0, 'rgba(40, 28, 16, 0.10)');
  glow.addColorStop(1, 'rgba(40, 28, 16, 0.62)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

/* Little triangle flags strung across the top of the card. */
function drawBunting(fromX, toX, y) {
  var colours = CONFIG.TITLE.buntingColours;
  var flagCount = 13;
  var step = (toX - fromX) / flagCount;

  ctx.strokeStyle = '#c9a87d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, y);
  ctx.quadraticCurveTo((fromX + toX) / 2, y + 12, toX, y);
  ctx.stroke();

  for (var i = 0; i < flagCount; i++) {
    var alongBy = (i + 0.5) / flagCount;
    var x = fromX + step * (i + 0.5);

    /* Follow the sag of the string. */
    var sag = 12 * 2 * alongBy * (1 - alongBy) * 2;
    var topY = y + sag;

    ctx.beginPath();
    ctx.moveTo(x - 9, topY);
    ctx.lineTo(x + 9, topY);
    ctx.lineTo(x, topY + 20);
    ctx.closePath();
    ctx.fillStyle = colours[i % colours.length];
    ctx.fill();
  }
}

/* The steps of the game, as coloured pills with arrows between. */
function drawLoopChips(centreX, y) {
  var chips = CONFIG.TITLE.chips;
  var chipW = 108;
  var gap = 26;
  var totalWidth = chips.length * chipW + (chips.length - 1) * gap;
  var x = centreX - totalWidth / 2;

  for (var i = 0; i < chips.length; i++) {
    var chip = chips[i];

    ENGINE.fillRound(x, y - 18, chipW, 36, 18, chip.fill);
    ENGINE.strokeRound(x, y - 18, chipW, 36, 18, chip.edge, 2);
    ENGINE.drawEmoji(chip.emoji, x + 26, y, 19);
    ENGINE.drawText(chip.label, x + 44, y + 1, 15, CONFIG.COLOURS.ink, 'left');

    if (i < chips.length - 1) {
      ENGINE.drawText('→', x + chipW + gap / 2, y, 18, CONFIG.COLOURS.inkSoft);
    }
    x += chipW + gap;
  }
}

/* One big obvious button. It breathes, so your eye lands on it. */
function drawStartButton(seconds) {
  var T = CONFIG.TITLE;
  var B = TITLE_PLAY_BUTTON;
  var pulse = Math.sin(seconds * 3) * 0.5 + 0.5;
  var width = B.width + pulse * 10;
  var height = B.height;
  var left = B.centreX - width / 2;
  var top = B.centreY - height / 2;

  /* A soft halo that swells in and out. */
  ctx.globalAlpha = 0.16 + pulse * 0.18;
  ENGINE.fillRound(left - 10, top - 8, width + 20, height + 16, 35, T.buttonColour);
  ctx.globalAlpha = 1;

  ENGINE.fillRound(left, top + 5, width, height, 27, T.buttonShadow);
  ENGINE.fillRound(left, top, width, height, 27, T.buttonColour);
  ENGINE.fillRound(left + 16, top + 7, width - 32, height * 0.34, 12,
                   'rgba(255, 255, 255, 0.24)');

  ENGINE.drawText(T.buttonText, B.centreX, B.centreY + 2, 19, '#ffffff');
}

/* The quieter button beside it. It doesn't breathe; Play is the star. */
function drawTutorialButton() {
  var T = CONFIG.TITLE;
  var B = TITLE_TUTORIAL_BUTTON;
  var left = B.centreX - B.width / 2;
  var top = B.centreY - B.height / 2;

  ENGINE.fillRound(left, top + 5, B.width, B.height, 27, T.tutorialButtonShadow);
  ENGINE.fillRound(left, top, B.width, B.height, 27, T.tutorialButtonColour);
  ENGINE.fillRound(left + 16, top + 7, B.width - 32, B.height * 0.34, 12,
                   'rgba(255, 255, 255, 0.24)');

  ENGINE.drawEmoji(T.tutorialButtonEmoji, left + 30, B.centreY + 1, 22);
  ENGINE.drawText(T.tutorialButtonText, B.centreX + 14, B.centreY + 2, 17, '#ffffff');
}

/* One of the cats, posing on the front page. */
function drawTitleCat(recipe, x, y, bob) {
  drawVillager({
    emoji: recipe.emoji, x: x, y: y, lift: bob,
    headSize: 48, bodyWidth: 36, bodyHeight: 26,
    bodyColour: recipe.colour, trimColour: 'rgba(255, 255, 255, 0.45)',
    tail: true
  });
}
