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
    startPrompt: 'Press SPACE to open the gate',
    controls: 'Arrow keys or W A S D to walk  ·  SPACE to groom Biscuit  ·  M for music',
    titleHook: "Keep Biscuit's health up, and dodge the alley cats' furballs.",
    dayEndPrompt: 'Press SPACE for the next day',
    seasonEndTitle: 'Season complete!',
    seasonEndLine: 'Biscuit made it through the whole season, and so did Grandma.',
    showPrompt: 'Press R to play again',
    gameOverLine: 'Grandma has run out of HP and needs a long lie-down.',
    needGroom: 'Stand next to Biscuit and press SPACE to groom',
    allWell: 'Biscuit is glowing — now watch out for furballs',
    dodgeHint: 'Keep moving — don’t let the furballs catch you!'
  }

});
