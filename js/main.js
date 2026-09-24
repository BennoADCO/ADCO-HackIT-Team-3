/* ==========================================================================
   MAIN.JS  —  WHERE IT ALL STARTS
   ==========================================================================

   Sets everything up when the page loads, then every frame (about 60
   times a second) it reads the keys, runs the rules, and draws the
   picture.

   The game is always in one of four screens:
     'title'   — the front page
     'playing' — actually playing
     'dayEnd'  — the end-of-day summary
     'show'    — the Fashion Show, at the end of the season

   Where everything else lives:
     js/config/      every number and word — the files to fiddle with
     js/engine/      the machinery: pens, keyboard, sound, loop. Rarely touched.
     js/rules/       WHAT HAPPENS: cats, Grandma, the work, the shop, the days
     js/drawing/     WHAT IT LOOKS LIKE: the village, the bars, the screens
   ========================================================================== */

function startGame() {
  ctx = ENGINE.setupCanvas('game');
  ENGINE.startListening();
  resetGame();
  state.screen = 'title';
  ENGINE.startLoop(everyFrame);
}


/* ==========================================================================
   THE FRAME — runs about 60 times a second
   ========================================================================== */

function everyFrame(dt) {
  if (ENGINE.wasPressed('m')) { ENGINE.toggleMute(); }

  if (state.screen === 'title') {
    if (ENGINE.wasPressed(' ', 'enter')) { resetGame(); }
    drawTitleScreen();
    return;
  }

  if (state.screen === 'dayEnd') {
    if (ENGINE.wasPressed(' ', 'enter')) { startNextDay(); }
    drawWorld();
    drawDayEndScreen();
    return;
  }

  if (state.screen === 'show') {
    if (ENGINE.wasPressed('r', ' ', 'enter')) { resetGame(); }
    drawWorld();
    drawFashionShow();
    return;
  }

  updatePlaying(dt);
  drawWorld();
  drawHud();
  drawBottomBar();
  drawMessage();
}

function updatePlaying(dt) {
  updateDayClock(dt);
  if (state.screen !== 'playing') { return; }

  var i;

  /* Grandma only moves when she isn't in the middle of a job. */
  if (state.action) {
    updateAction(dt);
    state.grandma.walking = false;
  } else {
    moveGrandma(dt);

    var thing = findNearestThing();
    if (ENGINE.wasPressed(' ')) {
      tryToStartAction(thing);
    }

    /* Number keys only do anything while you're standing at the shop. */
    if (thing && thing.kind === 'station' && thing.station.key === 'shop') {
      for (i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
        if (ENGINE.wasPressed(String(i + 1))) { tryToBuy(i); }
      }
    }
  }

  for (i = 0; i < state.cats.length; i++) {
    updateCat(state.cats[i], dt);
  }
  keepCatsApart();

  updateParticles(dt);

  if (state.messageTimer > 0) { state.messageTimer -= dt; }

  /* The occasional meow from somewhere across the sanctuary. */
  state.ambientMeowTimer -= dt;
  if (state.ambientMeowTimer <= 0) {
    state.ambientMeowTimer = CONFIG.AUDIO.ambientMeowSeconds * ENGINE.randomBetween(0.6, 1.5);
    if (state.cats.length > 0) {
      ENGINE.meow(CONFIG.AUDIO.meowBasePitch * ENGINE.randomBetween(0.7, 1.3));
    }
  }
}


/* ==========================================================================
   Off we go. This runs once the page has finished loading.
   ========================================================================== */

window.addEventListener('load', startGame);
