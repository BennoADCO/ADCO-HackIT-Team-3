/* ==========================================================================
   ENGINE / SAVE.JS  —  REMEMBERING THE BEST SCORE
   ==========================================================================

   Saving can be blocked when the page is opened straight from a file,
   so every attempt is wrapped up safely. If it fails, the game simply
   forgets the score and carries on.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

  function loadBestScore() {
    try {
      var stored = window.localStorage.getItem('grannyCatYarnBest');
      var value = parseInt(stored, 10);
      return isNaN(value) ? 0 : value;
    } catch (e) {
      return 0;
    }
  }

  function saveBestScore(score) {
    try {
      window.localStorage.setItem('grannyCatYarnBest', String(score));
    } catch (e) { /* no memory available — not a problem */ }
  }


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.loadBestScore = loadBestScore;
  ENGINE.saveBestScore = saveBestScore;

})();
