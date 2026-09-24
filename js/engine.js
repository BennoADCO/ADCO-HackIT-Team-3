/* ==========================================================================
   ENGINE.JS  —  THE MACHINERY
   ==========================================================================

   This file is the plumbing. It does four jobs and then gets out of the way:

     1. Runs the "game loop" — the thing that redraws the picture about 60
        times a second, forever.
     2. Watches the keyboard so the game can ask "is the left arrow down?"
     3. Draws simple shapes and emoji onto the picture.
     4. Makes all the sound, from nothing, using the browser's built-in
        tone generator. There are no music files anywhere in this project.

   YOU ALMOST NEVER NEED TO EDIT THIS FILE.
   The numbers live in config.js and the rules live in game.js.

   Everything here is bundled into one thing called ENGINE, so the rest of
   the game says things like ENGINE.drawEmoji(...) or ENGINE.meow().
   ========================================================================== */

var ENGINE = (function () {

  /* ====================================================================
     SECTION 1 — THE PICTURE (the canvas)
     ==================================================================== */

  var canvas = null;
  var ctx = null;

  function setupCanvas(elementId) {
    canvas = document.getElementById(elementId);
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    ctx = canvas.getContext('2d');
    return ctx;
  }


  /* ====================================================================
     SECTION 2 — THE KEYBOARD
     ====================================================================

     'held' remembers which keys are being held down right now.
     'pressed' remembers which keys were tapped since the last frame — this
     is what you want for things that should happen once, like pressing
     Space to groom a cat. It gets wiped clean at the end of every frame.
     ==================================================================== */

  var held = {};
  var pressed = {};
  var anyInputYet = false;

  function onKeyDown(e) {
    var key = e.key.toLowerCase();
    if (!held[key]) { pressed[key] = true; }
    held[key] = true;
    anyInputYet = true;
    resumeAudio();
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
    window.addEventListener('mousedown', function () { resumeAudio(); });
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


  /* ====================================================================
     SECTION 3 — THE GAME LOOP
     ====================================================================

     'dt' is short for delta time: the number of seconds since the last
     frame, usually about 0.016. Everything that moves gets multiplied by
     it, so the game runs at the same speed on a fast laptop and a slow one.
     ==================================================================== */

  var lastTime = 0;
  var updateFunction = null;

  function frame(now) {
    var dt = (now - lastTime) / 1000;
    lastTime = now;

    // If someone switches tab for a minute, dt would be enormous and
    // everything would teleport. Cap it at a fifth of a second.
    if (dt > 0.2) { dt = 0.2; }
    if (dt < 0) { dt = 0; }

    updateMusic();
    if (updateFunction) { updateFunction(dt); }
    clearPressed();

    window.requestAnimationFrame(frame);
  }

  function startLoop(fn) {
    updateFunction = fn;
    lastTime = window.performance.now();
    window.requestAnimationFrame(frame);
  }


  /* ====================================================================
     SECTION 4 — DRAWING HELPERS
     ==================================================================== */

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
    var f = clamp(fraction, 0, 1);
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
    r = Math.round(clamp(r + amount, 0, 255));
    g = Math.round(clamp(g + amount, 0, 255));
    b = Math.round(clamp(b + amount, 0, 255));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }


  /* ====================================================================
     SECTION 4b — LITTLE VILLAGE CHARACTERS
     ====================================================================

     Everybody in this game — Grandma and every cat — is drawn the same
     way: a big round emoji head sitting on a small chunky body that the
     game draws with simple shapes. Big head, little body, soft shadow.

     'x' and 'y' are where the character's FEET are, not the middle.
     ==================================================================== */

  function drawVillager(o) {
    var x = o.x;
    var feetY = o.y;
    var bodyW = o.bodyWidth;
    var bodyH = o.bodyHeight;
    var headSize = o.headSize;
    var lift = o.lift || 0;          // a little bounce while walking

    var body = o.bodyColour;
    var dark = shade(body, -34);

    var bottom = feetY - 3 + lift;
    var top = bottom - bodyH;

    // The shadow stays on the ground even when the character bounces.
    drawShadow(x, feetY + 1, bodyW * 0.6, bodyW * 0.2);

    // A tail, for the cats.
    if (o.tail) {
      ctx.beginPath();
      ctx.moveTo(x + bodyW * 0.42, bottom - bodyH * 0.35);
      ctx.quadraticCurveTo(x + bodyW * 1.15, bottom - bodyH * 0.6,
                           x + bodyW * 0.92, top - bodyH * 0.5);
      ctx.strokeStyle = dark;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Two stubby legs.
    fillRound(x - bodyW * 0.30 - 4, bottom - 5, 9, 9, 4, dark);
    fillRound(x + bodyW * 0.30 - 5, bottom - 5, 9, 9, 4, dark);

    // Arms, drawn before the body so they tuck in behind it.
    ellipse(x - bodyW * 0.54, top + bodyH * 0.45, 6, 8, dark);
    ellipse(x + bodyW * 0.54, top + bodyH * 0.45, 6, 8, dark);

    // The body itself.
    fillRound(x - bodyW / 2, top, bodyW, bodyH, Math.min(bodyW, bodyH) * 0.45, body);

    // A pale hem along the bottom — Grandma's pinny, or a cat's tummy.
    if (o.trimColour) {
      fillRound(x - bodyW * 0.36, top + bodyH * 0.44, bodyW * 0.72,
                bodyH * 0.5, bodyH * 0.24, o.trimColour);
    }

    // A soft highlight so the body doesn't look flat.
    ellipse(x - bodyW * 0.2, top + bodyH * 0.26, bodyW * 0.16, bodyH * 0.16,
            'rgba(255,255,255,0.35)');

    // And the head on top.
    drawEmoji(o.emoji, x, top - headSize * 0.30, headSize);

    return top - headSize * 0.30;   // where the head ended up
  }

  // A round village tree: a trunk with a bobbly green top.
  function drawTree(x, baseY, size, colours) {
    var s = size;
    drawShadow(x, baseY + 2, 30 * s, 10 * s);

    fillRound(x - 7 * s, baseY - 34 * s, 14 * s, 34 * s, 5 * s, colours.treeTrunk);

    ellipse(x, baseY - 46 * s, 30 * s, 26 * s, colours.treeLeafLow);
    ellipse(x - 14 * s, baseY - 52 * s, 20 * s, 18 * s, colours.treeLeafTop);
    ellipse(x + 13 * s, baseY - 54 * s, 19 * s, 17 * s, colours.treeLeafTop);
    ellipse(x, baseY - 64 * s, 21 * s, 19 * s, colours.treeLeafTop);
  }

  // A simple five-petal flower.
  function drawFlower(x, y, colour) {
    var i;
    for (i = 0; i < 5; i++) {
      var angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      ellipse(x + Math.cos(angle) * 5, y + Math.sin(angle) * 5, 4, 4, colour);
    }
    ellipse(x, y, 2.6, 2.6, '#fff4c2');
  }


  /* ====================================================================
     SECTION 5 — SMALL MATHS HELPERS
     ==================================================================== */

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


  /* ====================================================================
     SECTION 6 — SOUND, MADE FROM NOTHING
     ====================================================================

     The browser can generate tones on demand. We build every sound in the
     game out of those: the music is plain notes, the meow is a wobbling
     tone that slides up and then back down behind a filter.

     Browsers refuse to make any noise until the user has pressed a key or
     clicked, which is why resumeAudio() gets called from the key handler.
     ==================================================================== */

  var audioCtx = null;
  var masterGain = null;
  var musicGain = null;
  var sfxGain = null;
  var muted = false;
  var audioBroken = false;

  function ensureAudio() {
    if (audioCtx) { return true; }
    if (audioBroken) { return false; }
    try {
      var AudioClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioClass) { audioBroken = true; return false; }
      audioCtx = new AudioClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.value = CONFIG.AUDIO.masterVolume;
      masterGain.connect(audioCtx.destination);

      musicGain = audioCtx.createGain();
      musicGain.gain.value = CONFIG.AUDIO.musicVolume;
      musicGain.connect(masterGain);

      sfxGain = audioCtx.createGain();
      sfxGain.gain.value = CONFIG.AUDIO.sfxVolume;
      sfxGain.connect(masterGain);
    } catch (e) {
      audioBroken = true;
      return false;
    }
    return true;
  }

  function resumeAudio() {
    if (!ensureAudio()) { return; }
    try {
      if (audioCtx.state === 'suspended') { audioCtx.resume(); }
    } catch (e) { /* nothing we can do; the game plays on in silence */ }
  }

  function toggleMute() {
    muted = !muted;
    if (ensureAudio()) {
      try {
        masterGain.gain.value = muted ? 0 : CONFIG.AUDIO.masterVolume;
      } catch (e) { /* ignore */ }
    }
    return muted;
  }

  function isMuted() { return muted; }

  // Turns a note name like 'C4' or 'F#3' into a frequency in Hz.
  var SEMITONES = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

  function noteToFreq(name) {
    var letter = name.charAt(0).toLowerCase();
    var rest = name.slice(1);
    var sharp = 0;
    if (rest.charAt(0) === '#') { sharp = 1; rest = rest.slice(1); }
    if (rest.charAt(0) === 'b') { sharp = -1; rest = rest.slice(1); }
    var octave = parseInt(rest, 10);
    var semitonesFromA4 = SEMITONES[letter] + sharp + (octave - 4) * 12 - 9;
    return 440 * Math.pow(2, semitonesFromA4 / 12);
  }

  // One simple note. Used for the music and for all the little chimes.
  function playTone(options) {
    if (!ensureAudio() || muted) { return; }
    try {
      var t = options.when || audioCtx.currentTime;
      var duration = options.duration || 0.3;
      var osc = audioCtx.createOscillator();
      osc.type = options.type || 'triangle';
      osc.frequency.setValueAtTime(options.freq, t);
      if (options.slideTo) {
        osc.frequency.exponentialRampToValueAtTime(options.slideTo, t + duration);
      }

      var gain = audioCtx.createGain();
      var peak = options.volume || 0.3;
      var attack = options.attack || 0.02;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(options.music ? musicGain : sfxGain);
      osc.start(t);
      osc.stop(t + duration + 0.05);
    } catch (e) { /* silence is survivable */ }
  }

  // A meow. A sawtooth tone that slides up then droops, wobbled by a
  // vibrato and squashed through a moving filter — which is roughly what a
  // cat is doing too.
  function meow(pitch, when, volume, throughMusic) {
    if (!ensureAudio() || muted) { return; }
    try {
      var t = when || audioCtx.currentTime;
      var f0 = pitch || CONFIG.AUDIO.meowBasePitch;
      var peak = volume || 0.5;
      var len = 0.5;

      var osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f0 * 0.78, t);
      osc.frequency.linearRampToValueAtTime(f0 * 1.22, t + 0.09);
      osc.frequency.linearRampToValueAtTime(f0 * 0.70, t + len * 0.85);

      var filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 7;
      filter.frequency.setValueAtTime(620, t);
      filter.frequency.linearRampToValueAtTime(2300, t + 0.11);
      filter.frequency.linearRampToValueAtTime(560, t + len);

      var gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + len);

      // The wobble in the middle of the meow.
      var lfo = audioCtx.createOscillator();
      lfo.frequency.value = 17;
      var lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 14;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(throughMusic ? musicGain : sfxGain);

      osc.start(t); osc.stop(t + len + 0.05);
      lfo.start(t); lfo.stop(t + len + 0.05);
    } catch (e) { /* ignore */ }
  }

  // Named sound effects the game asks for by name.
  function sound(name) {
    if (!ensureAudio() || muted) { return; }
    var now = audioCtx.currentTime;
    var i;

    if (name === 'spin') {
      for (i = 0; i < 4; i++) {
        playTone({ freq: 330 + i * 70, duration: 0.14, volume: 0.18,
                   type: 'sine', when: now + i * 0.06 });
      }
    } else if (name === 'knit') {
      playTone({ freq: 520, duration: 0.1, volume: 0.2, type: 'square', when: now });
      playTone({ freq: 660, duration: 0.1, volume: 0.2, type: 'square', when: now + 0.11 });
      playTone({ freq: 880, duration: 0.22, volume: 0.22, type: 'triangle', when: now + 0.22 });
    } else if (name === 'sell') {
      playTone({ freq: 784, duration: 0.16, volume: 0.25, type: 'sine', when: now });
      playTone({ freq: 1046, duration: 0.3, volume: 0.25, type: 'sine', when: now + 0.1 });
    } else if (name === 'buy') {
      playTone({ freq: 392, duration: 0.14, volume: 0.25, type: 'triangle', when: now });
      playTone({ freq: 587, duration: 0.3, volume: 0.25, type: 'triangle', when: now + 0.12 });
    } else if (name === 'deny') {
      playTone({ freq: 200, duration: 0.18, volume: 0.22, type: 'square', slideTo: 130, when: now });
    } else if (name === 'rare') {
      var notes = [660, 880, 1170, 1568];
      for (i = 0; i < notes.length; i++) {
        playTone({ freq: notes[i], duration: 0.4, volume: 0.22,
                   type: 'sine', when: now + i * 0.07 });
      }
    } else if (name === 'dayEnd') {
      var chord = [523, 659, 784];
      for (i = 0; i < chord.length; i++) {
        playTone({ freq: chord[i], duration: 1.1, volume: 0.18,
                   type: 'triangle', attack: 0.08, when: now + i * 0.05 });
      }
    } else if (name === 'fanfare') {
      var tune = [523, 659, 784, 1046, 784, 1046, 1318];
      for (i = 0; i < tune.length; i++) {
        playTone({ freq: tune[i], duration: 0.45, volume: 0.24,
                   type: 'triangle', when: now + i * 0.16 });
      }
    }
  }

  /* --- The background music ------------------------------------------
     Rather than playing a file, we book notes a fraction of a second in
     advance, over and over. The loop calls updateMusic() every frame and
     it tops up the booking.
     ------------------------------------------------------------------- */

  var musicNextTime = 0;
  var musicStep = 0;

  function updateMusic() {
    if (!CONFIG.AUDIO.musicOn || muted || !audioCtx || audioBroken) { return; }
    try {
      if (audioCtx.state !== 'running') { return; }
      var now = audioCtx.currentTime;
      if (musicNextTime < now) { musicNextTime = now + 0.06; }

      while (musicNextTime < now + 0.35) {
        scheduleMusicStep(musicStep, musicNextTime);
        musicNextTime += CONFIG.AUDIO.noteSeconds;
        musicStep++;
      }
    } catch (e) { /* ignore */ }
  }

  function scheduleMusicStep(step, when) {
    var audio = CONFIG.AUDIO;
    var bars = audio.musicBars;
    var bar = bars[Math.floor(step / 4) % bars.length];
    var noteInBar = step % 4;
    var melody = noteToFreq(bar.notes[noteInBar]);

    // The gentle melody note.
    playTone({
      freq: melody,
      duration: audio.noteSeconds * 1.6,
      volume: 0.26, type: 'triangle', attack: 0.09, when: when, music: true
    });

    // A soft bass note at the start of each bar.
    if (noteInBar === 0) {
      playTone({
        freq: noteToFreq(bar.bass),
        duration: audio.noteSeconds * 3.6,
        volume: 0.3, type: 'sine', attack: 0.15, when: when, music: true
      });
    }

    // And the cats sing along, in tune with the melody. Every so often one
    // of them goes a bit sharp or flat, because they are cats.
    if (audio.meowsInMusic &&
        (step - audio.meowStartsOnNote) % audio.meowEveryNotes === 0 &&
        step >= audio.meowStartsOnNote) {
      var wobble = 1 + (Math.random() - 0.5) * 0.1;
      meow(melody * audio.musicMeowPitch * wobble,
           when, audio.musicMeowVolume, true);
    }
  }


  /* ====================================================================
     SECTION 7 — REMEMBERING THE BEST SCORE
     ====================================================================

     Saving can be blocked when the page is opened straight from a file,
     so every attempt is wrapped up safely. If it fails, the game simply
     forgets the score and carries on.
     ==================================================================== */

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


  /* ====================================================================
     Hand the useful bits out to the rest of the game.
     ==================================================================== */

  return {
    setupCanvas: setupCanvas,
    startListening: startListening,
    startLoop: startLoop,

    isHeld: isHeld,
    wasPressed: wasPressed,
    hasInteracted: function () { return anyInputYet; },

    drawEmoji: drawEmoji,
    drawText: drawText,
    drawStickerText: drawStickerText,
    roundRect: roundRect,
    fillRound: fillRound,
    strokeRound: strokeRound,
    drawBar: drawBar,
    drawShadow: drawShadow,
    ellipse: ellipse,
    shade: shade,
    drawVillager: drawVillager,
    drawTree: drawTree,
    drawFlower: drawFlower,

    clamp: clamp,
    distance: distance,
    randomBetween: randomBetween,
    randomFrom: randomFrom,
    weightedPick: weightedPick,

    sound: sound,
    meow: meow,
    toggleMute: toggleMute,
    isMuted: isMuted,

    loadBestScore: loadBestScore,
    saveBestScore: saveBestScore
  };

})();
