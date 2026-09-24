/* ==========================================================================
   CONFIG / ENEMIES.JS  —  THE ENEMY CATS
   ==========================================================================

   Every number about the alley cats attacking the garden, the furballs
   they throw, and how each day's wave gets bigger.
   >>> ENEMY_TYPES is the fun one: rename them after people in the office. <<<

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     THE ENEMY CATS THEMSELVES
     ------------------------------------------------------------------
     >>> THIS IS THE FUN ONE TO EDIT. <<<
     Rename these after people in the office.

     'fireSeconds'   how often this cat throws a furball. Smaller = faster.
     'furballSpeed'  how fast its furballs fly, in dots per second.
     'damage'        how much HP a hit from this cat's furball costs.
     ------------------------------------------------------------------ */

  ENEMY_TYPES: [
    { name: 'Grumble',  emoji: '😾', colour: '#9aa3a8', fireSeconds: 2.6, furballSpeed: 210, damage: 8  },
    { name: 'Scratchy', emoji: '🙀', colour: '#c9b39a', fireSeconds: 1.8, furballSpeed: 260, damage: 6  },
    { name: 'Growler',  emoji: '😼', colour: '#b6b0ab', fireSeconds: 3.4, furballSpeed: 190, damage: 14 },
    { name: 'Snarl',    emoji: '😿', colour: '#d9a870', fireSeconds: 2.2, furballSpeed: 230, damage: 10 }
  ],

  // How big the emoji head and body are for an enemy cat.
  ENEMY: {
    headSize: 40,
    bodyWidth: 30,
    bodyHeight: 21
  },

  // The patch of ground the enemy cats prowl around in — the same rug
  // Grandma dodges across. Feet positions, not heads.
  ENEMY_AREA: { left: 256, right: 644, top: 230, bottom: 454 },

  ENEMY_WANDER_SPEED: 40,       // dots per second — pacing, agitated
  ENEMY_PAUSE_SECONDS: 1.2,     // how long a cat sits still between prowls
  ENEMY_MINIMUM_GAP: 70,        // how far apart the game keeps them


  /* ------------------------------------------------------------------
     WAVES — how many cats show up each day
     ------------------------------------------------------------------
     Day 1 uses the first number, Day 2 the second, and so on. If there
     are more days than numbers, the last number repeats.

     Day 5's number is ignored: that's Big Tony's day, and he turns up on
     his own (see js/config/boss.js).
     ------------------------------------------------------------------ */

  //             1  2  3  4  5(boss)
  WAVE_SIZES: [  3, 4, 6, 8, 5,
  //             6  7  8  9 10
                 6, 7, 8, 8, 9,
  //            11 12 13 14 15
                 9, 10, 10, 11, 11,
  //            16 17 18 19 20 21
                 12, 12, 13, 13, 14, 15 ],

  // Every day beyond Day 1, cats throw a little faster and a little
  // harder. 1 = no change. 0.9 means 10% faster each day.
  WAVE_FIRE_SPEEDUP_PER_DAY: 0.9,

  // ...but it stops there, or the late days would be impossible. 0.5 means
  // "never more than twice as fast as Day 1, however long the season is".
  WAVE_FIRE_SPEEDUP_FLOOR: 0.5,


  /* ------------------------------------------------------------------
     FURBALLS
     ------------------------------------------------------------------ */

  FURBALL_SIZE: 16,           // how big a furball looks, in dots across
  FURBALL_COLOUR: '#8a7460',
  FURBALL_DARK: '#5d4733',

  // After Grandma is hit, she is safe from further hits for this long,
  // so one bad moment doesn't melt her whole health bar at once.
  GRANDMA_INVULNERABLE_SECONDS: 0.9,

  // How much HP Grandma gets back for surviving a whole day, before the
  // next (bigger) wave arrives.
  OVERNIGHT_HP_RECOVERY: 25,


  /* ------------------------------------------------------------------
     SCORING — how many furballs you've dodged, and the medal it earns
     ------------------------------------------------------------------ */

  DODGE_MEDALS: [
    { name: 'Nervous Newcomer',    emoji: '🙀', min: 0   },
    { name: 'Steady On Your Feet', emoji: '😼', min: 20  },
    { name: 'Furball Dodger',      emoji: '🐾', min: 50  },
    { name: 'Reflexes Of Steel',   emoji: '⚡', min: 100 },
    { name: 'LEGEND OF THE GARDEN', emoji: '🏆', min: 200 }
  ],

});
