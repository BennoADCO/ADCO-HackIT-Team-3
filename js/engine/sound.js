/* ==========================================================================
   ENGINE / SOUND.JS  —  SOUND, MADE FROM NOTHING
   ==========================================================================

   The browser can generate tones on demand. We build every sound in the
   game out of those: the music is plain notes, the meow is a wobbling
   tone that slides up and then back down behind a filter. There are no
   music files anywhere in this project.

   Browsers refuse to make any noise until the user has pressed a key or
   clicked, which is why resumeAudio() gets called from the keyboard file.

   The tune and the volumes live in js/config/sound.js.

   Part of the ENGINE toolbox. The rest of the game uses it by saying
   ENGINE.something(...). You almost never need to edit this file.
   ========================================================================== */

var ENGINE = ENGINE || {};   // join the shared ENGINE toolbox (the first engine file to load creates it)

(function () {

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
      var f0 = pitch || 560;
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
    } else if (name === 'throw') {
      playTone({ freq: 340, duration: 0.1, volume: 0.14, type: 'sine', slideTo: 220, when: now });
    } else if (name === 'hit') {
      playTone({ freq: 180, duration: 0.22, volume: 0.3, type: 'sawtooth', slideTo: 60, when: now });
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


  /* Hand the useful bits out to the rest of the game. */
  ENGINE.sound = sound;
  ENGINE.meow = meow;
  ENGINE.toggleMute = toggleMute;
  ENGINE.isMuted = isMuted;
  ENGINE.resumeAudio = resumeAudio;
  ENGINE.updateMusic = updateMusic;

})();
