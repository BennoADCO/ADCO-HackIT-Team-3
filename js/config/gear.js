/* ==========================================================================
   CONFIG / GEAR.JS  —  WEAPONS AND ARMOUR FOR THE FRIENDLY CATS
   ==========================================================================

   Beaten enemy cats sometimes drop a ⚔️ weapon or 🦺 armour upgrade.
   Grandma walks over it to pick it up, then chooses which friendly cat
   gets it. Each upgrade moves that cat up one step on the lists below.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     WEAPONS — make a cat's swipes hit harder
     ------------------------------------------------------------------
     The first line is what every cat starts with (bare paws). Each
     weapon upgrade moves the cat one line further down.

     'damage'      how much each swipe hurts. An enemy can take 3
                   (see ENEMY_HITS_TO_BEAT in js/config/biscuit.js),
                   so damage 1 = 3 swipes, 1.5 = 2 swipes, 3 = 1 swipe.
     'swipeSpeed'  1 is normal. 2 means the cat swipes twice as often.
     'extraReach'  how many extra dots of reach the cat gets.

     The last three numbers are where the weapon is drawn, measured
     from the cat's head: across (minus = left), down, and how big.
     ------------------------------------------------------------------ */

  WEAPONS: [
    { name: 'Bare paws', emoji: '',   damage: 1,   swipeSpeed: 1, extraReach: 0,  drawX: -26, drawY: 22, size: 22 },
    { name: 'Stick',     emoji: '🥢', damage: 1.5, swipeSpeed: 1, extraReach: 0,  drawX: -26, drawY: 22, size: 22 },
    { name: 'Sword',     emoji: '🗡️', damage: 3,   swipeSpeed: 1, extraReach: 0,  drawX: -26, drawY: 20, size: 24 },
    { name: 'Trident',   emoji: '🔱', damage: 3,   swipeSpeed: 2, extraReach: 40, drawX: -28, drawY: 16, size: 28 }
  ],


  /* ------------------------------------------------------------------
     ARMOUR — makes a cat's health bar last longer
     ------------------------------------------------------------------
     'damageTaken'  how much of each furball's damage gets through.
                    1 = all of it, 0.5 = half, 0.25 = a quarter.
     The drawing numbers work the same as for weapons.
     ------------------------------------------------------------------ */

  ARMOUR: [
    { name: 'No armour',    emoji: '',   damageTaken: 1,    drawX: 0,  drawY: 0,   size: 18 },
    { name: 'Knitted vest', emoji: '🧶', damageTaken: 0.75, drawX: 0,  drawY: 26,  size: 18 },
    { name: 'Shield',       emoji: '🛡️', damageTaken: 0.5,  drawX: 26, drawY: 30,  size: 22 },
    { name: 'Crown',        emoji: '👑', damageTaken: 0.25, drawX: 0,  drawY: -16, size: 18 }
  ],


  /* ------------------------------------------------------------------
     DROPS — what beaten enemy cats leave behind
     ------------------------------------------------------------------ */

  GEAR_DROP_CHANCE: 0.5,        // 0.5 = half of beaten cats drop something. 1 = every one.
  GEAR_WEAPON_CHANCE: 0.5,      // of those drops, how many are weapons (the rest are armour)
  GEAR_PICKUP_RANGE: 44,        // how close Grandma must walk to pick a drop up

  GEAR_DROP_EMOJI: { weapon: '⚔️', armour: '🦺' },
  GEAR_DROP_SIZE: 30,

  // If you give an upgrade to a cat that already has the best one,
  // it gets this much health back instead, so it's never wasted.
  GEAR_MAXED_HEAL: 30,


  /* ------------------------------------------------------------------
     THE WORDS
     ------------------------------------------------------------------ */

  GEAR_WORDS: {
    weapon: 'weapon upgrade',
    armour: 'armour upgrade',
    choose: 'Who gets the',            // followed by "weapon upgrade?"
    pressNumber: 'Press the number next to a cat',
    equipped: 'now has a',              // "Biscuit now has a Sword!"
    alreadyBest: 'already has the best — healed instead',
    dropHint: 'An upgrade dropped! Walk Grandma over it to pick it up.'
  }

});
