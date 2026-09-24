/* ==========================================================================
   RULES / DAYS.JS  —  THE PASSING OF THE DAY
   ==========================================================================

   The day clock, the good night's sleep between days, and the medal you
   win at the Fashion Show.
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

  /* A good night's sleep does everybody good. */
  for (var i = 0; i < state.cats.length; i++) {
    state.cats[i].health = ENGINE.clamp(
      state.cats[i].health + CONFIG.OVERNIGHT_HEALTH_RECOVERY, 0, 100);
    state.cats[i].fluff = 1;
  }

  state.screen = 'playing';
}

function finishSeason() {
  state.screen = 'show';
  state.beatBest = state.prestige > state.bestScore;
  if (state.beatBest) {
    state.bestScore = state.prestige;
    ENGINE.saveBestScore(state.prestige);
  }
  ENGINE.sound('fanfare');
}

function medalFor(score) {
  var best = CONFIG.MEDALS[0];
  for (var i = 0; i < CONFIG.MEDALS.length; i++) {
    if (score >= CONFIG.MEDALS[i].min) { best = CONFIG.MEDALS[i]; }
  }
  return best;
}
