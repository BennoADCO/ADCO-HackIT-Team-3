/* ==========================================================================
   RULES / DAYS.JS  —  THE PASSING OF THE DAY
   ==========================================================================

   The day clock, the good night's rest between days, and reaching the
   end of the season.
   ========================================================================== */

function updateDayClock(dt) {
  state.dayTime += dt;
  if (state.dayTime < CONFIG.DAY_LENGTH_SECONDS) { return; }

  state.dayTime = CONFIG.DAY_LENGTH_SECONDS;
  state.action = null;

  if (state.day >= CONFIG.DAYS_IN_SEASON) {
    finishSeason();
  } else {
    state.screen = 'dayEnd';
    ENGINE.sound('dayEnd');
  }
}

function startNextDay() {
  state.day++;
  state.dayTime = 0;
  state.dayStats = freshDayStats();
  state.dayHits = 0;
  resetHorseForDay();   // a new day, a new pointless horse

  /* A good night's rest does everybody good — Biscuit, and Grandma too,
     before tomorrow's bigger wave of furballs arrives. */
  for (var i = 0; i < state.cats.length; i++) {
    state.cats[i].health = ENGINE.clamp(
      state.cats[i].health + CONFIG.OVERNIGHT_HEALTH_RECOVERY, 0, 100);
  }
  state.grandma.hp = ENGINE.clamp(
    state.grandma.hp + CONFIG.OVERNIGHT_HP_RECOVERY, 0, CONFIG.GRANDMA.maxHp);

  spawnWave(state.day);
  state.screen = 'playing';
  say('Day ' + state.day + ' — ' + state.enemies.length + ' cats this time!');
}

function finishSeason() {
  state.screen = 'seasonEnd';
  state.beatBest = state.dodged > state.bestScore;
  if (state.beatBest) {
    state.bestScore = state.dodged;
    ENGINE.saveBestScore(state.dodged);
  }
  ENGINE.sound('fanfare');
}
