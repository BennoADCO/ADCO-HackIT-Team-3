/* ==========================================================================
   RULES / POPUPS.JS  —  LITTLE FLOATING NUMBERS AND MESSAGES
   ==========================================================================

   The "-10 💥" numbers that float up and fade, and the message bubble
   along the top.
   ========================================================================== */

function addParticle(x, y, text, colour, size) {
  state.particles.push({
    x: x, y: y, text: text, colour: colour, size: size || 16,
    life: 1.4, maxLife: 1.4, riseSpeed: 42
  });
}

function updateParticles(dt) {
  for (var i = state.particles.length - 1; i >= 0; i--) {
    var p = state.particles[i];
    p.life -= dt;
    p.y -= p.riseSpeed * dt;
    if (p.life <= 0) { state.particles.splice(i, 1); }
  }
}

/* Shows a line of text at the top of the screen for a few seconds. */
function say(text) {
  state.message = text;
  state.messageTimer = 3.2;
}
