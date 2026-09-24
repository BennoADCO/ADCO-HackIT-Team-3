/* ==========================================================================
   CONFIG / CATS.JS  —  THE CATS
   ==========================================================================

   Health, personalities, and the cats themselves.
   >>> STARTING_CATS is the fun one: rename them after people in the office. <<<

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     CAT HEALTH — the green bar under each cat's name
     ------------------------------------------------------------------
     Health runs from 0 (very poorly) to 100 (glowing with health).
     It slowly drips downwards unless you groom them.

     'min' is the lowest health that still counts as that mood.
     The mood name shows in the bottom bar when you stand next to a cat.
     ------------------------------------------------------------------ */

  HEALTH_TIERS: [
    { name: 'Poorly',  emoji: '🤒', min: 0  },
    { name: 'Okay',    emoji: '😺', min: 30 },
    { name: 'Healthy', emoji: '😸', min: 62 },
    { name: 'Glowing', emoji: '😻', min: 88 }
  ],

  // The colour of the health bar under every cat, and the grey behind it.
  CAT_HEALTH_BAR_COLOUR: '#3fbf4f',
  CAT_HEALTH_BAR_EMPTY: 'rgba(0, 0, 0, 0.15)',

  // How fast health drips away, in health-points per second, before personality.
  HEALTH_DECAY_PER_SECOND: 2.4,


  /* ------------------------------------------------------------------
     PERSONALITIES
     ------------------------------------------------------------------
     Every cat has one. This is where the character comes from.

     healthDecay   1 is normal. 2 means its health drops twice as fast.
     groomJoy      1 is normal. 2 means grooming heals it twice as much.
     ------------------------------------------------------------------ */

  PERSONALITIES: {
    lazy: {
      name: 'Lazy', emoji: '😴',
      blurb: 'Enormous coat. Cannot be hurried.',
      healthDecay: 0.5, groomJoy: 1.0
    },
    playful: {
      name: 'Playful', emoji: '🧸',
      blurb: 'Gets bored fast.',
      healthDecay: 2.0, groomJoy: 1.2
    },
    diva: {
      name: 'Diva', emoji: '💅',
      blurb: 'Needs constant attention. Knows it.',
      healthDecay: 1.9, groomJoy: 1.0
    },
    curious: {
      name: 'Curious', emoji: '🔍',
      blurb: 'Feels better whenever Grandma is nearby.',
      healthDecay: 1.0, groomJoy: 1.0
    },
    mischievous: {
      name: 'Mischievous', emoji: '😼',
      blurb: 'Never sits still for long.',
      healthDecay: 1.1, groomJoy: 1.1
    },
    affectionate: {
      name: 'Affectionate', emoji: '🥰',
      blurb: 'A cuddle goes a very long way.',
      healthDecay: 1.2, groomJoy: 2.4
    }
  },

  // How close Grandma must be for a Curious cat to feel better, and how much
  // health per second it gains while she's there.
  CURIOUS_RANGE: 130,
  CURIOUS_HEALTH_PER_SECOND: 4,


  /* ------------------------------------------------------------------
     THE CATS THEMSELVES
     ------------------------------------------------------------------
     >>> THIS IS THE FUN ONE TO EDIT. <<<
     Rename these after people in the office.

     'emoji'  is the cat's face.
     'colour' is the colour of its little body.
     Keep the personality names spelled exactly as in PERSONALITIES above.
     'followsGrandma: true' makes that cat trot along beside Grandma
     instead of wandering the rug, with its health bar above its head.
     ------------------------------------------------------------------ */

  STARTING_CATS: [
    { name: 'Biscuit', emoji: '🐱', colour: '#f2c384', personality: 'lazy', followsGrandma: true }
  ],

  // How Biscuit keeps up with Grandma.
  FOLLOW_GAP: 58,             // how close (in dots) Biscuit gets before stopping
  FOLLOW_SPEED: 250,          // dots per second. Grandma walks at 270.


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
