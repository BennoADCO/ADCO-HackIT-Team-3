/* ==========================================================================
   ENGINE / LOOP.JS  —  THE GAME LOOP
   ==========================================================================

   Redraws the picture about 60 times a second, forever.

   'dt' is short for delta time: the number of seconds since the last
   frame, usually about 0.016. Everything that moves gets multiplied by
   it, so the game runs at the same speed on a fast laptop and a slow one.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

  var lastTime = 0;
  var updateFunction = null;

  function frame(now) {
    var dt = (now - lastTime) / 1000;
    lastTime = now;

    // If someone switches tab for a minute, dt would be enormous and
    // everything would teleport. Cap it at a fifth of a second.
    if (dt > 0.2) { dt = 0.2; }
    if (dt < 0) { dt = 0; }

    ENGINE.updateMusic();
    if (updateFunction) { updateFunction(dt); }
    ENGINE.clearPressed();
    ENGINE.clearClicks();

    window.requestAnimationFrame(frame);
  }

  function startLoop(fn) {
    updateFunction = fn;
    lastTime = window.performance.now();
    window.requestAnimationFrame(frame);
  }


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.startLoop = startLoop;

})();
