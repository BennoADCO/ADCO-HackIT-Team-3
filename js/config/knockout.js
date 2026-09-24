/* ==========================================================================
   CONFIG / KNOCKOUT.JS  —  WHEN FURBALLS HIT A FRIENDLY CAT
   ==========================================================================

   Furballs can hit the friendly cats as well as Grandma. A cat whose
   health reaches zero is knocked out: it stops following Grandma and
   stops swiping until she grooms it back on its feet. Armour (see
   js/config/gear.js) makes each hit hurt less.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  KNOCKOUT: {
    hitRadius: 20,            // how close a furball must get to a cat to hit it
    damageMultiplier: 1,      // 1 = cats take the same damage as Grandma. 0.5 = half.
    safeSeconds: 0.6,         // after a hit, the cat can't be hit again for this long
    wakeUpHealth: 25,         // a knocked-out cat gets up once groomed to this much health
    emoji: '😵',              // the face a knocked-out cat pulls
    words: {
      knockedOut: 'is knocked out! Groom them to wake them up',   // after the cat's name
      wokeUp: 'is back on their feet!',
      hint: 'is knocked out — walk over and groom them (SPACE)!'
    }
  }

});
