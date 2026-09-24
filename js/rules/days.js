/* ==========================================================================
   RULES / DAYS.JS  —  THE PASSING OF THE DAY
   ==========================================================================

   The day clock, the good night's rest between days, and reaching the
   end of the last day.
   ========================================================================== */

function updateDayClock(dt) {
  state.dayTime += dt;
  if (state.dayTime < CONFIG.DAY_LENGTH_SECONDS) { return; }

  state.dayTime = CONFIG.DAY_LENGTH_SECONDS;

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
  state.dayHits = 0;

  /* A good night's rest, before tomorrow's bigger wave arrives. */
  state.grandma.hp = ENGINE.clamp(
    state.grandma.hp + CONFIG.OVERNIGHT_HP_RECOVERY, 0, CONFIG.GRANDMA.maxHp);

  spawnWave(state.day);
  state.screen = 'playing';
  say('Day ' + state.day + ' — ' + state.enemies.length + ' cats this time!');
}

function finishSeason() {
  state.screen = 'show';
  state.beatBest = state.dodged > state.bestScore;
  if (state.beatBest) {
    state.bestScore = state.dodged;
    ENGINE.saveBestScore(state.dodged);
  }
  ENGINE.sound('fanfare');
}
