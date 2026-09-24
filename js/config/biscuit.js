/* ==========================================================================
   CONFIG / BISCUIT.JS  —  BISCUIT FIGHTS BACK
   ==========================================================================

   Biscuit (the cat who follows Grandma) swipes at any enemy cat that
   gets close enough. Walk Grandma towards the enemies to bring Biscuit
   into range — but that means walking into the furballs too.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     BISCUIT'S SWIPE
     ------------------------------------------------------------------ */

  BISCUIT_ATTACK: {
    range: 120,            // how close (in dots) an enemy must be to Biscuit to get swiped
    secondsBetween: 1.2,   // how long Biscuit waits between swipes. Smaller = faster
    lungeDistance: 16,     // how far Biscuit jumps towards the enemy when swiping
    slashColour: '#ffffff' // the colour of the claw marks
  },

  // How many bare-paw swipes it takes before an enemy cat gives up and
  // runs away. Weapons hit harder, so need fewer (see js/config/gear.js).
  ENEMY_HITS_TO_BEAT: 3,

  // The little bar over each enemy cat's head showing how close it is to giving up.
  ENEMY_HEALTH_BAR_COLOUR: '#e5484d',
  ENEMY_HEALTH_BAR_EMPTY: 'rgba(0, 0, 0, 0.2)',

  // How fast a beaten cat runs off the screen, in dots per second.
  ENEMY_FLEE_SPEED: 420,

  // The words that pop up.
  BISCUIT_WORDS: {
    swipe: '💢',
    chasedOff: '💨 Biscuit chased off',   // followed by the enemy's name
    allGone: 'Biscuit cleared the garden! 🐱🏆'
  }

});
