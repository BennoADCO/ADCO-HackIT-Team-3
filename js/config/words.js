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
    controls: 'Arrow keys or W A S D to dodge  ·  M for music',
    dayEndPrompt: 'Press SPACE for the next day',
    showPrompt: 'Press R to run it again',
    gameOverLine: 'Grandma has run out of HP and needs a long lie-down.',
    dodgeHint: 'Keep moving — don’t let the furballs catch you!'
  }

});
