/* ==========================================================================
   DRAWING / HORSE.JS  —  THE RANDOM HORSE
   ==========================================================================

   The random horse. Drawn just like everybody else (see drawVillager in
   js/drawing/characters.js): a big emoji head on a chunky little body.
   It does nothing, so there's nothing else to draw.
   ========================================================================== */

function drawHorse() {
  var h = CONFIG.HORSE;
  drawVillager({
    emoji: h.emoji,
    x: state.horse.x,
    y: state.horse.y,
    lift: -horseLift(),
    headSize: h.headSize,
    bodyWidth: h.bodyWidth,
    bodyHeight: h.bodyHeight,
    bodyColour: h.bodyColour,
    tail: true
  });
}
