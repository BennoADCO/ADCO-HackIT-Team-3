/* ==========================================================================
   CONFIG / BOSS.JS  —  BIG TONY, THE BOSS CAT
   ==========================================================================

   On Day 5 the whole alley sends one enormous cat instead of a wave.
   Big Tony 😼 takes a LOT of swipes from Biscuit to knock down — but once
   he is down, he joins Grandma and fights on your side for the rest of
   the season.

   If the clock runs out before Biscuit beats him, he gets away, and then
   he turns up in EVERY later wave until he's finally beaten. The damage
   you did to him is remembered from day to day.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     WHICH DAY THE BOSS SHOWS UP
     ------------------------------------------------------------------
     On this day, nobody else turns up — it's just Grandma, Biscuit
     and Big Tony.
     ------------------------------------------------------------------ */

  BOSS_DAY: 5,


  /* ------------------------------------------------------------------
     BIG TONY HIMSELF
     ------------------------------------------------------------------
     >>> A GOOD ONE TO EDIT. <<< Rename him after somebody in the office.

     'hitsToBeat'      how many Biscuit swipes it takes to knock him down.
                       A normal alley cat takes 3.
     'fireSeconds'     how often he throws. Smaller = faster.
     'furballsPerThrow' how many furballs come out at once, in a fan.
                       Set this to 1 if the fan is too hard to dodge.
     'spreadDegrees'   how wide that fan is. Bigger = easier to slip between.
     ------------------------------------------------------------------ */

  BOSS: {
    name: 'Big Tony',
    emoji: '😼',
    colour: '#6f6259',        // his big dark body
    crown: '👑',              // the little badge floating over his head

    hitsToBeat: 12,

    fireSeconds: 1.6,
    furballSpeed: 240,
    furballSize: 24,          // his furballs are bigger than everyone else's
    damage: 11,
    furballsPerThrow: 3,
    spreadDegrees: 26,

    wanderSpeed: 62,          // dots per second — he lumbers about
    pauseSeconds: 0.8,
    minimumGap: 120,          // how much room he needs around him

    // How big he is drawn. A normal cat's head is 40.
    headSize: 78,
    bodyWidth: 58,
    bodyHeight: 42,

    // How long the game pauses on the "HE'S JOINED YOU" moment before the
    // end-of-day screen appears, in seconds.
    celebrateSeconds: 2.2
  },


  /* ------------------------------------------------------------------
     HIS BIG HEALTH BAR ALONG THE TOP
     ------------------------------------------------------------------ */

  BOSS_BAR: {
    y: 70,                    // how far down the screen it sits
    width: 560,
    height: 22,
    colour: '#e5484d',
    empty: 'rgba(0, 0, 0, 0.35)',
    nearlyColour: '#f0b429'   // it turns amber once he's over halfway down
  },


  /* ------------------------------------------------------------------
     BIG TONY ONCE HE'S ON YOUR SIDE
     ------------------------------------------------------------------
     He fights like Biscuit, but slower and harder: he waits longer
     between swipes, and each swipe counts as TWO hits.
     ------------------------------------------------------------------ */

  TONY_ATTACK: {
    range: 140,             // he has a longer reach than Biscuit's 120
    secondsBetween: 2.4,    // Biscuit swipes every 1.2 seconds — Tony is half as often
    hitsPerSwipe: 2,        // but each swipe does the work of two
    lungeDistance: 22,
    slashColour: '#ffe9a8'
  },

  // He keeps a bit further back than Biscuit so the two of them don't
  // stand on top of each other behind Grandma.
  TONY_FOLLOW_GAP: 96,

  // How big he's drawn once he's one of yours (still bigger than Biscuit,
  // but not the monster he was).
  TONY_SIZE: {
    headSize: 52,
    bodyWidth: 40,
    bodyHeight: 28
  },

  // The cat he becomes once he's recruited. Same shape as the entries in
  // STARTING_CATS over in js/config/cats.js — so he can be groomed, and he
  // has a health bar, just like Biscuit.
  TONY_JOINS: {
    name: 'Big Tony',
    emoji: '😼',
    colour: '#a08a76',
    personality: 'scrapper',
    followsGrandma: true
  },


  /* ------------------------------------------------------------------
     THE WORDS
     ------------------------------------------------------------------ */

  BOSS_WORDS: {
    arrives: '😼 BIG TONY HAS SHOWN UP — and he came alone.',
    hint: 'Walk Grandma close so Biscuit can swipe at him. Keep moving!',
    halfway: '😼 Big Tony is wobbling...',
    beaten: '💥 BIG TONY IS DOWN!',
    joins: '😼 Big Tony has joined Grandma! He fights on your side now.',
    escaped: '😼 Big Tony got away — he\'ll be back with the next wave.',
    backAgain: '😼 Big Tony is back!'
  }

});
