/* ==========================================================================
   ENGINE / MATHS.JS  —  SMALL SUMS
   ==========================================================================

   Keeping a number inside a range, measuring the gap between two things,
   and rolling dice.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

  function clamp(value, low, high) {
    if (value < low) { return low; }
    if (value > high) { return high; }
    return value;
  }

  function distance(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function randomBetween(low, high) {
    return low + Math.random() * (high - low);
  }

  function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // Picks one item from a list, where each item has a bigger or smaller
  // chance. 'weights' is a matching list of numbers — bigger means likelier.
  function weightedPick(list, weights) {
    var total = 0;
    var i;
    for (i = 0; i < weights.length; i++) { total += weights[i]; }
    var roll = Math.random() * total;
    for (i = 0; i < list.length; i++) {
      roll -= weights[i];
      if (roll <= 0) { return list[i]; }
    }
    return list[list.length - 1];
  }


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.clamp = clamp;
  ENGINE.distance = distance;
  ENGINE.randomBetween = randomBetween;
  ENGINE.randomFrom = randomFrom;
  ENGINE.weightedPick = weightedPick;

})();
