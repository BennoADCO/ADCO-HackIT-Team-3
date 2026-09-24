/* ==========================================================================
   CONFIG / WORDS.JS  —  WORDS ON SCREEN
   ==========================================================================

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     WORDS ON SCREEN
     ------------------------------------------------------------------ */

  TEXT: {
    startPrompt: 'Press SPACE to open the gates',
    controls: 'Arrow keys or W A S D to walk  ·  SPACE to use  ·  M for music',
    dayEndPrompt: 'Press SPACE for the next day',
    showPrompt: 'Press R to run the season again',
    gameOverLine: 'Grandma has run out of HP and needs a long lie-down.',
    needFluff: 'Groom a cat with a ☁️ above its head',
    needSpin: 'Take your fluff to the 🎡 Spinning Wheel',
    needKnit: 'Take your yarn to the 🪡 Knitting Nook',
    needSell: 'Take your knitting to the 🏪 Market Stall',
    needShop: 'Spend your coins at the 🛋️ Comfort Shop',
    waiting: 'The coats are growing back — go and say hello to someone'
  }

});
