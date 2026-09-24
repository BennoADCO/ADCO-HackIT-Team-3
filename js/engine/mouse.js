/* ==========================================================================
   ENGINE / MOUSE.JS  —  WHERE THE MOUSE CLICKED
   ==========================================================================

   Remembers where the last click landed, in game dots (0-900 across,
   0-600 down), so buttons drawn on the canvas can be clicked. The click
   is forgotten at the end of every frame, like a key tap.

   The browser stretches the picture to fit the window, so a click's
   position on screen has to be shrunk back down to game dots first.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

  var click = null;

  function startListeningToMouse(elementId) {
    var canvas = document.getElementById(elementId);
    canvas.addEventListener('mousedown', function (e) {
      click = toGameDots(canvas, e.clientX, e.clientY);
    });
  }

  function toGameDots(canvas, clientX, clientY) {
    var box = canvas.getBoundingClientRect();
    return {
      x: (clientX - box.left - canvas.clientLeft) * (canvas.width / canvas.clientWidth),
      y: (clientY - box.top - canvas.clientTop) * (canvas.height / canvas.clientHeight)
    };
  }

  // Did a click land inside this box this frame?
  function wasClickedInside(left, top, width, height) {
    if (!click) { return false; }
    return click.x >= left && click.x <= left + width &&
           click.y >= top && click.y <= top + height;
  }

  function clearClicks() {
    click = null;
  }


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.startListeningToMouse = startListeningToMouse;
  ENGINE.toGameDots = toGameDots;
  ENGINE.wasClickedInside = wasClickedInside;
  ENGINE.clearClicks = clearClicks;

})();
