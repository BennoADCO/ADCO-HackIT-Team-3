/* ==========================================================================
   MAIN.JS  —  WHERE IT ALL STARTS
   ==========================================================================

   Sets everything up when the page loads, then every frame (about 60
   times a second) it reads the keys, runs the rules, and draws the
   picture.

   The game is always in one of five screens:
     'title'    — the front page
     'playing'  — actually playing
     'dayEnd'   — the end-of-day summary
     'show'     — the victory screen, after surviving all five days
     'gameOver' — Grandma ran out of HP

   Where everything else lives:
     js/config/      every number and word — the files to fiddle with
     js/engine/      the machinery: pens, keyboard, sound, loop. Rarely touched.
     js/rules/       WHAT HAPPENS: Grandma, the enemy cats, the days
     js/drawing/     WHAT IT LOOKS LIKE: the garden, the bars, the screens
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
    drawVictoryScreen();
    return;
  }

  if (state.screen === 'gameOver') {
    if (ENGINE.wasPressed('r', ' ', 'enter')) { resetGame(); }
    drawWorld();
    drawGameOver();
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

  moveGrandma(dt);
  updateGrandmaInvulnerability(dt);

  updateEnemies(dt);
  keepEnemiesApart();
  updateFurballs(dt);

  updateParticles(dt);

  /* Out of HP? Then it's game over. */
  if (isGrandmaOutOfHp()) {
    state.screen = 'gameOver';
    ENGINE.sound('dayEnd');
    return;
  }

  if (state.messageTimer > 0) { state.messageTimer -= dt; }
}


/* ==========================================================================
   Off we go. This runs once the page has finished loading.
   ========================================================================== */

window.addEventListener('load', startGame);
