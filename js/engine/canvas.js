/* ==========================================================================
   ENGINE / CANVAS.JS  —  THE PICTURE AND THE PENS
   ==========================================================================

   Sets up the 900 x 600 picture (the "canvas") and hands the rest of the
   game some simple pens: draw an emoji, write some text, a rounded box, a
   progress bar, a soft shadow.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

  var canvas = null;
  var ctx = null;

  function setupCanvas(elementId) {
    canvas = document.getElementById(elementId);
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    ctx = canvas.getContext('2d');
    return ctx;
  }

  var EMOJI_FONT = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  var TEXT_FONT = '"Trebuchet MS", "Segoe UI", Verdana, sans-serif';

  function drawEmoji(emoji, x, y, size) {
    // The fill colour must be set, and must be fully opaque. Browsers draw
    // colour emoji using the see-through-ness of whatever colour was last
    // used, so if we skip this line the emoji come out faded or invisible
    // depending on what was drawn just before them.
    ctx.fillStyle = '#000000';
    ctx.font = size + 'px ' + EMOJI_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y);
  }

  // weight can be 'bold' or 'normal'. align is 'center', 'left' or 'right'.
  function drawText(text, x, y, size, colour, align, weight) {
    ctx.font = (weight || 'bold') + ' ' + size + 'px ' + TEXT_FONT;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = colour;
    ctx.fillText(text, x, y);
  }

  // Big chunky lettering with a thick outline and a coloured drop shadow,
  // like a sticker. Used for the title on the welcome screen.
  function drawStickerText(text, x, y, size, fill, outline, drop) {
    ctx.font = 'bold ' + size + 'px ' + TEXT_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    // The offset copy underneath, which gives it depth.
    if (drop) {
      var offset = size * 0.075;
      ctx.lineWidth = size * 0.22;
      ctx.strokeStyle = drop;
      ctx.strokeText(text, x, y + offset);
      ctx.fillStyle = drop;
      ctx.fillText(text, x, y + offset);
    }

    // Then the outline, then the letter itself on top.
    ctx.lineWidth = size * 0.2;
    ctx.strokeStyle = outline;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }

  // A rectangle with rounded corners. Used for every panel and bar.
  function roundRect(x, y, w, h, radius) {
    var r = Math.min(radius, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function fillRound(x, y, w, h, radius, colour) {
    roundRect(x, y, w, h, radius);
    ctx.fillStyle = colour;
    ctx.fill();
  }

  function strokeRound(x, y, w, h, radius, colour, thickness) {
    roundRect(x, y, w, h, radius);
    ctx.strokeStyle = colour;
    ctx.lineWidth = thickness || 2;
    ctx.stroke();
  }

  // A little progress bar. 'fraction' is between 0 and 1.
  function drawBar(x, y, w, h, fraction, fillColour, backColour) {
    var f = ENGINE.clamp(fraction, 0, 1);
    fillRound(x, y, w, h, h / 2, backColour || 'rgba(0,0,0,0.25)');
    if (f > 0.001) {
      fillRound(x, y, Math.max(h, w * f), h, h / 2, fillColour);
    }
  }

  // A soft oval shadow so things don't look like they're floating.
  function drawShadow(x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(60, 45, 30, 0.16)';
    ctx.fill();
  }

  function ellipse(x, y, w, h, colour) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = colour;
    ctx.fill();
  }

  // Takes a colour like '#f2c384' and makes it darker or lighter.
  // A negative amount darkens, a positive amount lightens.
  function shade(hex, amount) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    r = Math.round(ENGINE.clamp(r + amount, 0, 255));
    g = Math.round(ENGINE.clamp(g + amount, 0, 255));
    b = Math.round(ENGINE.clamp(b + amount, 0, 255));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.setupCanvas = setupCanvas;
  ENGINE.drawEmoji = drawEmoji;
  ENGINE.drawText = drawText;
  ENGINE.drawStickerText = drawStickerText;
  ENGINE.roundRect = roundRect;
  ENGINE.fillRound = fillRound;
  ENGINE.strokeRound = strokeRound;
  ENGINE.drawBar = drawBar;
  ENGINE.drawShadow = drawShadow;
  ENGINE.ellipse = ellipse;
  ENGINE.shade = shade;

})();
