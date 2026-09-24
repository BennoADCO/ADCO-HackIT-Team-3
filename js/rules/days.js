/* ==========================================================================
   RULES / DAYS.JS  —  THE PASSING OF THE DAY
   ==========================================================================

   The day clock, the good night's sleep between days, and the end of
   the season.
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
  }

  state.screen = 'playing';
}

function finishSeason() {
  state.screen = 'seasonEnd';
  ENGINE.sound('fanfare');
}
