/* ==========================================================================
   CONFIG / BASICS.JS  —  DAYS, GRANDMA AND THE WORK
   ==========================================================================

   Every file in js/config/ is nothing but numbers and words. Nothing
   happens in these files — they just write down what the game should use.

   THESE ARE THE FILES TO CHANGE if you want the game to feel different:
     basics.js    how long a day is, Grandma, how long each job takes
     cats.js      the cats: names, personalities, health
     knitting.js  magic fur, what Grandma knits, the Fashion Show medals
     shop.js      the Comfort Shop: prices and what the upgrades do
     village.js   the look: colours, shops, trees, flowers, welcome screen
     sound.js     the music and the meows
     words.js     the words on screen

   HOW TO CHANGE SOMETHING:
     1. Find the line.  2. Change the number or the text inside the quotes.
     3. Save the file.  4. Press F5 in the browser.

   TWO RULES SO YOU DON'T BREAK IT:
     - Text always sits inside 'single quotes'. Numbers never do.
     - Every line ends in a comma, except the last one in a group.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     THE BASICS
     ------------------------------------------------------------------ */

  GAME_TITLE: "Grandma's Purradise",
  GAME_SUBTITLE: 'Fluff in. Fashion out.',

  // The picture is always this many dots across and down. The browser
  // stretches it to fit the window, so don't worry about screen sizes.
  CANVAS_WIDTH: 900,
  CANVAS_HEIGHT: 600,

  // How long a single day lasts, in seconds, and how many days in a season.
  DAY_LENGTH_SECONDS: 90,
  DAYS_IN_SEASON: 5,


  /* ------------------------------------------------------------------
     GRANDMA — the character you control
     ------------------------------------------------------------------
     She is drawn as a proper little character: a round head with a chunky
     body underneath, in the style of a village life-sim. The head is an
     emoji; everything below the neck is drawn by the game.
     ------------------------------------------------------------------ */

  GRANDMA: {
    emoji: '👵',
    headSize: 46,        // how big her head is drawn, in dots
    bodyWidth: 36,
    bodyHeight: 34,
    bodyColour: '#e88aa8',    // her cardigan
    trimColour: '#fff1e0',    // her apron / pinny
    speed: 270,          // dots she travels per second. Higher = faster.
    reach: 82,           // how close she must get to use a cat or a building
    startX: 450,
    startY: 360,

    // Her HP (hit points) — the red bar above her head. If it ever
    // reaches 0 it's GAME OVER. Nothing hurts her yet.
    maxHp: 100,
    hpBarColour: '#e5484d',
    hpBarEmpty: 'rgba(0, 0, 0, 0.25)'
  },


  /* ------------------------------------------------------------------
     THE WORK — how long each job takes and how much it produces
     ------------------------------------------------------------------ */

  // Seconds Grandma spends on each job. She can't move while working.
  GROOM_SECONDS: 0.85,
  SPIN_SECONDS: 1.1,
  KNIT_SECONDS: 1.4,
  SELL_SECONDS: 0.9,

  // The processing chain. Fluff becomes yarn, yarn becomes a product.
  FLUFF_PER_YARN: 3,      // 3 balls of fluff make 1 ball of yarn
  YARN_PER_PRODUCT: 2,    // 2 balls of yarn make 1 knitted thing

  // Health a cat gets back when you groom it, before its personality is applied.
  GROOM_HEALTH_BONUS: 14,

  // Cats sleep well. Every cat wakes up with this much more health each morning.
  OVERNIGHT_HEALTH_RECOVERY: 22,

  // Health every cat gets back when you buy something at the Comfort Shop.
  SHOP_HEALTH_BONUS: 15,

});
