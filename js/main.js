/* ==========================================================================
   MAIN.JS  —  WHERE IT ALL STARTS
   ==========================================================================

   Sets everything up when the page loads, then every frame (about 60
   times a second) it reads the keys, runs the rules, and draws the
   picture.

   The game is always in one of six screens:
     'title'     — the front page
     'tutorial'  — the (completely wrong) platformer tutorial
     'playing'   — actually playing
     'dayEnd'    — the end-of-day summary
     'seasonEnd' — the end of the season, after surviving all five days
     'gameOver'  — Grandma ran out of HP

   Where everything else lives:
     js/config/      every number and word — the files to fiddle with
     js/engine/      the machinery: pens, keyboard, sound, loop. Rarely touched.
     js/rules/       WHAT HAPPENS: cats, Grandma, grooming, the enemy cats,
                     the horse, the days
     js/drawing/     WHAT IT LOOKS LIKE: the garden, the bars, the screens
   ========================================================================== */

function startGame() {
  ctx = ENGINE.setupCanvas('game');
  ENGINE.startListening();
  ENGINE.startListeningToMouse('game');
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
    if (ENGINE.wasPressed(' ', 'enter') || wasButtonClicked(TITLE_PLAY_BUTTON)) {
      resetGame();
    } else if (ENGINE.wasPressed('t') || wasButtonClicked(TITLE_TUTORIAL_BUTTON)) {
      startTutorial();
    }
    drawTitleScreen();
    return;
  }

  if (state.screen === 'tutorial') {
    updateTutorial(dt);
    drawTutorial();
    return;
  }

  if (state.screen === 'dayEnd') {
    if (ENGINE.wasPressed(' ', 'enter')) { startNextDay(); }
    drawWorld();
    drawDayEndScreen();
    return;
  }

  if (state.screen === 'seasonEnd') {
    if (ENGINE.wasPressed('r', ' ', 'enter')) { resetGame(); }
    drawWorld();
    drawSeasonEnd();
    return;
  }

  if (state.screen === 'gameOver') {
    if (ENGINE.wasPressed('r', ' ', 'enter')) { resetGame(); }
    drawWorld();
    drawGameOver();
    return;
  }

  /* Just picked up an upgrade? Everything pauses while you choose which
     cat gets it (js/rules/gear.js). */
  if (state.gearChoice) {
    updateGearChoice();
    drawWorld();
    drawHud();
    /* Only draw the box if it's still open — choosing a cat closes it. */
    if (state.gearChoice) { drawGearChoice(); }
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

  /* Grandma stands still while she grooms. Furballs and the horse don't
     pause for that — standing still to groom Biscuit is riskier. */
  if (state.action) {
    updateAction(dt);
    state.grandma.walking = false;
  } else {
    moveGrandma(dt);
    keepGrandmaOutOfHorse();   // she has to walk round the horse
    updateDrops(dt);           // walking over a weapon or armour picks it up

    var thing = findNearestThing();
    if (ENGINE.wasPressed(' ')) {
      tryToStartAction(thing);
    }
  }

  updateGrandmaInvulnerability(dt);
  updateCatSafeTimers(dt);     // cats' short safe spell after a furball hit

  for (i = 0; i < state.cats.length; i++) {
    updateCat(state.cats[i], dt);
  }
  keepCatsApart();

  updateEnemies(dt);
  keepEnemiesApart();
  updateFurballs(dt);

  updateBiscuitAttacks(dt);   // Biscuit (and Big Tony) swipe at nearby enemies
  updateFleeingEnemies(dt);

  updateHorse(dt);

  updateParticles(dt);

  /* Out of HP? Then it's game over. */
  if (isGrandmaOutOfHp()) {
    state.action = null;
    state.screen = 'gameOver';
    ENGINE.sound('dayEnd');
    return;
  }

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
