/* ==========================================================================
   RULES / DAYS.JS  —  THE PASSING OF THE DAY
   ==========================================================================

   The day clock, the good night's rest between days, and reaching the
   end of the season.
   ========================================================================== */

function updateDayClock(dt) {
  // The clock ticks on, but never past the end of the day.
  state.dayTime = Math.min(state.dayTime + dt, CONFIG.DAY_LENGTH_SECONDS);

  /* Every enemy cat chased off? Wait a moment so the player can watch the
     last one run away — or watch Big Tony get up on Grandma's side — then
     end the day early. */
  if (state.enemies.length === 0) {
    state.clearedFor += dt;
    if (state.clearedFor >= CONFIG.WAVE_CLEARED_PAUSE_SECONDS) {
      endDay();
    }
    return;
  }

  /* Otherwise the day ends when the clock runs out, as a safety net. */
  if (state.dayTime >= CONFIG.DAY_LENGTH_SECONDS) {
    endDay();
  }
}

/* The day is over, one way or the other: show the summary, or the
   season's ending if this was the last day. */
function endDay() {
  state.action = null;

  /* Is Big Tony still standing? Then he's escaped for today, and he'll be
     back with the next wave (js/rules/boss.js). */
  noteBossEscaped();

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
  wakeEveryoneOvernight();   // knocked-out cats get back up (js/rules/knockout.js)

  /* Any upgrades left lying about are gone by morning. The gear the
     cats are already wearing stays on. */
  state.drops = [];
  state.gearChoice = null;

  spawnWave(state.day);
  state.screen = 'playing';
  say(dayOpeningMessage());
}

/* What the message bubble says as a new day starts. */
function dayOpeningMessage() {
  var boss = bossOnScreen();

  /* Boss day — he's on his own, so make a proper fuss of it. */
  if (boss && state.enemies.length === 1) {
    return CONFIG.BOSS_WORDS.arrives;
  }
  if (boss) {
    return CONFIG.BOSS_WORDS.backAgain + ' ' + state.enemies.length + ' cats today.';
  }
  return 'Day ' + state.day + ' — ' + state.enemies.length + ' cats this time!';
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
