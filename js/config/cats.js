/* ==========================================================================
   CONFIG / CATS.JS  —  THE CATS
   ==========================================================================

   Moods, personalities, and the cats themselves.
   >>> STARTING_CATS is the fun one: rename them after people in the office. <<<

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     CAT MOOD
     ------------------------------------------------------------------
     Mood runs from 0 (thoroughly unimpressed) to 100 (blissful).
     It slowly drips downwards unless you look after them.

     'fluffValue'  multiplies how much fluff you get.
     'rareChance'  multiplies the odds of magical fur (see RARITIES below).
     ------------------------------------------------------------------ */

  MOOD_TIERS: [
    { name: 'Grumpy',   emoji: '😾', min: 0,  colour: '#ef7a6a', fluffValue: 0.5, rareChance: 0.25 },
    { name: 'Content',  emoji: '😺', min: 30, colour: '#f4c95d', fluffValue: 1.0, rareChance: 1.0  },
    { name: 'Happy',    emoji: '😸', min: 62, colour: '#7fcf6b', fluffValue: 1.5, rareChance: 2.2  },
    { name: 'Blissful', emoji: '😻', min: 88, colour: '#b98bff', fluffValue: 2.0, rareChance: 4.0  }
  ],

  // How fast mood drips away, in mood-points per second, before personality.
  MOOD_DECAY_PER_SECOND: 2.4,

  // How fast a cat regrows its fluff, in seconds for a full coat.
  FLUFF_REGROW_SECONDS: 9,


  /* ------------------------------------------------------------------
     PERSONALITIES
     ------------------------------------------------------------------
     Every cat has one. This is where the character comes from.

     moodDecay     1 is normal. 2 means it gets grumpy twice as fast.
     fluffPerGroom how many balls of fluff a single grooming gives
     regrowSpeed   1 is normal. 0.5 means its coat takes twice as long.
     groomJoy      1 is normal. 2 means grooming cheers it up twice as much.
     rareBonus     1 is normal. 2 means twice as likely to grow magic fur.
     ------------------------------------------------------------------ */

  PERSONALITIES: {
    lazy: {
      name: 'Lazy', emoji: '😴',
      blurb: 'Enormous coat. Cannot be hurried.',
      moodDecay: 0.5, fluffPerGroom: 2, regrowSpeed: 0.55, groomJoy: 1.0, rareBonus: 1.0
    },
    playful: {
      name: 'Playful', emoji: '🧸',
      blurb: 'Gets bored fast. Buy the Toy Basket.',
      moodDecay: 2.0, fluffPerGroom: 1, regrowSpeed: 1.2, groomJoy: 1.2, rareBonus: 1.2
    },
    diva: {
      name: 'Diva', emoji: '💅',
      blurb: 'Grows the finest fur. Knows it.',
      moodDecay: 1.9, fluffPerGroom: 1, regrowSpeed: 1.0, groomJoy: 1.0, rareBonus: 2.6
    },
    curious: {
      name: 'Curious', emoji: '🔍',
      blurb: 'Cheers up whenever Grandma is nearby.',
      moodDecay: 1.0, fluffPerGroom: 1, regrowSpeed: 1.1, groomJoy: 1.0, rareBonus: 1.3
    },
    mischievous: {
      name: 'Mischievous', emoji: '😼',
      blurb: 'Fast-growing coat. Occasionally steals yarn.',
      moodDecay: 1.1, fluffPerGroom: 1, regrowSpeed: 1.6, groomJoy: 1.1, rareBonus: 1.1
    },
    affectionate: {
      name: 'Affectionate', emoji: '🥰',
      blurb: 'A cuddle goes a very long way.',
      moodDecay: 1.2, fluffPerGroom: 1, regrowSpeed: 1.0, groomJoy: 2.4, rareBonus: 1.0
    }
  },

  // How close Grandma must be for a Curious cat to perk up, and how much
  // mood per second it gains while she's there.
  CURIOUS_RANGE: 130,
  CURIOUS_MOOD_PER_SECOND: 4,

  // A mischievous cat tries to pinch a ball of yarn this often (seconds).
  MISCHIEF_EVERY_SECONDS: 26,


  /* ------------------------------------------------------------------
     THE CATS THEMSELVES
     ------------------------------------------------------------------
     >>> THIS IS THE FUN ONE TO EDIT. <<<
     Rename these after people in the office.

     'emoji'  is the cat's face.
     'colour' is the colour of its little body.
     Keep the personality names spelled exactly as in PERSONALITIES above.
     ------------------------------------------------------------------ */

  STARTING_CATS: [
    { name: 'Biscuit',   emoji: '🐱', colour: '#f2c384', personality: 'lazy' },
    { name: 'Duchess',   emoji: '😻', colour: '#fbf0e2', personality: 'diva' },
    { name: 'Pickles',   emoji: '😼', colour: '#b6b0ab', personality: 'mischievous' },
    { name: 'Bobbin',    emoji: '😺', colour: '#f0a15c', personality: 'affectionate' }
  ],

  // The pool that adopted cats are drawn from, in order.
  ADOPTABLE_CATS: [
    { name: 'Marmalade', emoji: '🐈', colour: '#f3a552', personality: 'playful' },
    { name: 'Purlie',    emoji: '😽', colour: '#d8c3e8', personality: 'curious' },
    { name: 'Crumpet',   emoji: '😸', colour: '#e8d2a8', personality: 'lazy' },
    { name: 'Tinsel',    emoji: '😻', colour: '#cfe4f2', personality: 'diva' },
    { name: 'Noodle',    emoji: '🐱', colour: '#f7ddc2', personality: 'playful' },
    { name: 'Waffle',    emoji: '😺', colour: '#d9a870', personality: 'affectionate' },
    { name: 'Socks',     emoji: '😼', colour: '#9aa3a8', personality: 'mischievous' },
    { name: 'Casta',     emoji: '🐈', colour: '#c9b39a', personality: 'curious' }
  ],

  // The patch of ground the cats wander around in.
  // These numbers are where their FEET go, not their heads.
  CAT_AREA: { left: 256, right: 644, top: 230, bottom: 454 },

  CAT: {
    headSize: 40,
    bodyWidth: 30,
    bodyHeight: 21
  },

  CAT_WANDER_SPEED: 26,       // dots per second — slow and pottering
  CAT_PAUSE_SECONDS: 2.5,     // how long a cat sits still between strolls
  CAT_MINIMUM_GAP: 88,        // how far apart the game keeps them

});
