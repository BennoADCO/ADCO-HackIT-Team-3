/* ==========================================================================
   ENGINE / KEYBOARD.JS  —  WHICH KEYS ARE DOWN
   ==========================================================================

   'held' remembers which keys are being held down right now.
   'pressed' remembers which keys were tapped since the last frame — this
   is what you want for things that should happen once, like pressing
   Space to groom a cat. It gets wiped clean at the end of every frame.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

  var held = {};
  var pressed = {};
  var anyInputYet = false;

  function onKeyDown(e) {
    var key = e.key.toLowerCase();
    if (!held[key]) { pressed[key] = true; }
    held[key] = true;
    anyInputYet = true;
    ENGINE.resumeAudio();
    // Stop the arrow keys and space from scrolling the page underneath.
    if (key === ' ' || key === 'arrowup' || key === 'arrowdown' ||
        key === 'arrowleft' || key === 'arrowright') {
      e.preventDefault();
    }
  }

  function onKeyUp(e) {
    held[e.key.toLowerCase()] = false;
  }

  function startListening() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    // Clicking also counts as "the user did something", which is what the
    // browser needs before it will let us make any sound.
    window.addEventListener('mousedown', function () { ENGINE.resumeAudio(); });
  }

  // Is this key being held down? Pass several names for the same action,
  // e.g. isHeld('arrowleft', 'a')
  function isHeld() {
    for (var i = 0; i < arguments.length; i++) {
      if (held[arguments[i]]) { return true; }
    }
    return false;
  }

  // Was this key tapped this frame?
  function wasPressed() {
    for (var i = 0; i < arguments.length; i++) {
      if (pressed[arguments[i]]) { return true; }
    }
    return false;
  }

  function clearPressed() {
    pressed = {};
  }

  function hasInteracted() { return anyInputYet; }


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.startListening = startListening;
  ENGINE.isHeld = isHeld;
  ENGINE.wasPressed = wasPressed;
  ENGINE.clearPressed = clearPressed;
  ENGINE.hasInteracted = hasInteracted;

})();
