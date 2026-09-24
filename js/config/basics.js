/* ==========================================================================
   CONFIG / BASICS.JS  —  DAYS, GRANDMA AND GROOMING
   ==========================================================================

   Every file in js/config/ is nothing but numbers and words. Nothing
   happens in these files — they just write down what the game should use.

   THESE ARE THE FILES TO CHANGE if you want the game to feel different:
     basics.js    how long a day is, Grandma, and grooming
     cats.js      the cats: names, personalities, health
     enemies.js   the enemy cats: names, speed, furballs, how waves grow
     village.js   the look: colours, trees, flowers, welcome screen, the horse
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

  GAME_TITLE: "Grandma's Last Stand",
  GAME_SUBTITLE: 'Keep Biscuit happy. Dodge the furballs.',

  // The picture is always this many dots across and down. The browser
  // stretches it to fit the window, so don't worry about screen sizes.
  CANVAS_WIDTH: 900,
  CANVAS_HEIGHT: 600,

  // How long a single day lasts, in seconds, and how many days you must
  // survive to win.
  // 21 days at 45 seconds is about 16 minutes of play. If that's too long
  // for a demo, drop DAY_LENGTH_SECONDS to 30 or DAYS_IN_SEASON to 10.
  DAY_LENGTH_SECONDS: 45,
  DAYS_IN_SEASON: 21,


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
    reach: 82,           // how close she must get to groom a cat
    startX: 450,
    startY: 360,

    // Her hitbox — how close a furball has to get to actually hit her.
    // Smaller than she looks on screen, so near-misses feel fair.
    hitRadius: 22,

    // Her HP (hit points) — the red bar above her head. If it ever
    // reaches 0 it's GAME OVER.
    maxHp: 100,
    hpBarColour: '#e5484d',
    hpBarEmpty: 'rgba(0, 0, 0, 0.25)'
  },


  /* ------------------------------------------------------------------
     GROOMING
     ------------------------------------------------------------------ */

  // Seconds Grandma spends brushing a cat. She can't move while grooming
  // — which also means she can't dodge, so time it carefully.
  GROOM_SECONDS: 0.85,

  // Health a cat gets back from one groom, before its personality is applied.
  // Health goes from 0 to 100, so 25 means about four grooms from empty to full.
  GROOM_HEALTH_BONUS: 25,

  // Cats sleep well. Every cat wakes up with this much more health each morning.
  OVERNIGHT_HEALTH_RECOVERY: 22,

});
