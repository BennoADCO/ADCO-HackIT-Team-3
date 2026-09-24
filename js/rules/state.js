/* ==========================================================================
   RULES / STATE.JS  —  WHAT THE GAME REMEMBERS
   ==========================================================================

   The one box (called "state") that holds everything about the season in
   progress, and how to wipe it clean for a new season.
   ========================================================================== */

/* The pen for drawing the picture. It is set up when the page loads. */
var ctx = null;

/* Everything the game needs to remember lives in this one box. */
var state = null;


/* Wipes the slate clean and starts a brand new run. */
function resetGame() {
  var best = state ? state.bestScore : ENGINE.loadBestScore();

  state = {
    screen: 'playing',
    day: 1,
    dayTime: 0,

    grandma: {
      x: CONFIG.GRANDMA.startX,
      y: CONFIG.GRANDMA.startY,
      bob: 0,
      walking: false,
      hp: CONFIG.GRANDMA.maxHp,
      invulnerable: 0
    },

    cats: [],

    enemies: [],
    furballs: [],
    fleeing: [],      // enemy cats Biscuit has beaten, running off the screen
    swipes: [],       // Biscuit's claw marks, fading out
    drops: [],        // weapon and armour upgrades lying on the ground
    gearChoice: null, // set while the "which cat gets it?" box is open
    dodged: 0,        // furballs successfully dodged this run — the score
    dayHits: 0,       // times she was hit today, for the end-of-day screen

    /* Big Tony, the boss cat (js/rules/boss.js). */
    tonyRecruited: false,   // has he been knocked down and joined Grandma?
    tonyOutThere: false,    // did he escape his day and keep coming back?
    tonyDamageTaken: 0,     // how battered he already is, remembered between days

    action: null,
    particles: [],
    message: '',
    messageTimer: 0,
    ambientMeowTimer: CONFIG.AUDIO.ambientMeowSeconds,

    dayStats: freshDayStats(),

    bestScore: best,
    beatBest: false
  };

  for (var i = 0; i < CONFIG.STARTING_CATS.length; i++) {
    var recipe = CONFIG.STARTING_CATS[i];
    state.cats.push(recipe.followsGrandma ? makeFollowerCat(recipe) : makeCat(recipe));
  }

  /* The random horse (see js/rules/horse.js). */
  resetHorseForDay();

  spawnWave(state.day);
  say('Day 1 — ' + state.enemies.length + ' cats have shown up!');
}

function freshDayStats() {
  return { grooms: 0 };
}

/* Which dodge-count medal has this score earned? */
function medalFor(score) {
  var best = CONFIG.DODGE_MEDALS[0];
  for (var i = 0; i < CONFIG.DODGE_MEDALS.length; i++) {
    if (score >= CONFIG.DODGE_MEDALS[i].min) { best = CONFIG.DODGE_MEDALS[i]; }
  }
  return best;
}
