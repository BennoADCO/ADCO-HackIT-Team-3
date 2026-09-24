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


/* Wipes the slate clean and starts a brand new season. */
function resetGame() {
  state = {
    screen: 'playing',
    day: 1,
    dayTime: 0,

    grandma: {
      x: CONFIG.GRANDMA.startX,
      y: CONFIG.GRANDMA.startY,
      bob: 0,
      walking: false,
      hp: CONFIG.GRANDMA.maxHp
    },

    cats: [],

    action: null,
    particles: [],
    message: '',
    messageTimer: 0,
    ambientMeowTimer: CONFIG.AUDIO.ambientMeowSeconds,

    dayStats: freshDayStats()
  };

  for (var i = 0; i < CONFIG.STARTING_CATS.length; i++) {
    var recipe = CONFIG.STARTING_CATS[i];
    state.cats.push(recipe.followsGrandma ? makeFollowerCat(recipe) : makeCat(recipe));
  }
}

function freshDayStats() {
  return { grooms: 0 };
}
