/* ==========================================================================
   RULES / STATE.JS  —  WHAT THE GAME REMEMBERS
   ==========================================================================

   The one box (called "state") that holds everything about the season in
   progress, how to wipe it clean for a new season, and a few small
   look-up helpers the other rules files share.
   ========================================================================== */

/* The pen for drawing the picture. It is set up when the page loads. */
var ctx = null;

/* Everything the game needs to remember lives in this one box. */
var state = null;


/* Wipes the slate clean and starts a brand new season. */
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
      hp: CONFIG.GRANDMA.maxHp
    },

    cats: [],
    coins: 0,
    prestige: 0,

    fluff: emptyBag(),
    yarn: emptyBag(),
    products: [],
    showcase: [],

    upgrades: { toys: false, lounge: false, parlour: false },
    adoptCost: shopItem('adopt').cost,
    nextAdoptIndex: 0,

    action: null,
    particles: [],
    message: '',
    messageTimer: 0,
    ambientMeowTimer: CONFIG.AUDIO.ambientMeowSeconds,

    dayStats: freshDayStats(),
    seasonStats: { fluff: 0, products: 0, coins: 0 },

    bestScore: best,
    beatBest: false
  };

  for (var i = 0; i < CONFIG.STARTING_CATS.length; i++) {
    var recipe = CONFIG.STARTING_CATS[i];
    state.cats.push(recipe.followsGrandma ? makeFollowerCat(recipe) : makeCat(recipe));
  }

  /* The random horse (see js/rules/horse.js). */
  resetHorseForDay();
}

function freshDayStats() {
  return { fluff: 0, yarn: 0, products: 0, coins: 0, prestige: 0, rares: 0 };
}

/* A "bag" holds a count for each kind of fur: plain, glitter, rainbow... */
function emptyBag() {
  var bag = {};
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    bag[CONFIG.RARITIES[i].key] = 0;
  }
  return bag;
}

function bagTotal(bag) {
  var total = 0;
  for (var i = 0; i < CONFIG.RARITIES.length; i++) {
    total += bag[CONFIG.RARITIES[i].key];
  }
  return total;
}

function shopItem(key) {
  for (var i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
    if (CONFIG.SHOP_ITEMS[i].key === key) { return CONFIG.SHOP_ITEMS[i]; }
  }
  return null;
}

function stationByKey(key) {
  for (var i = 0; i < CONFIG.STATIONS.length; i++) {
    if (CONFIG.STATIONS[i].key === key) { return CONFIG.STATIONS[i]; }
  }
  return null;
}
