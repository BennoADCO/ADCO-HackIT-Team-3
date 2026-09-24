/* ==========================================================================
   CONFIG / TUTORIAL.JS  —  THE (COMPLETELY WRONG) TUTORIAL
   ==========================================================================

   The Tutorial button on the welcome screen opens a retro side-on
   "Stage 1", like an old 8-bit robot game. It teaches Grandma to run,
   jump, slide and fire a Yarn Buster. None of that is in the real game.
   That is the joke.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  TUTORIAL: {

    /* ------------------------------------------------------------------
       THE STEPS — shown one at a time, in this order.
         text    the big instruction at the top
         tip     the small line underneath it
         praise  flashes up when you do it

       Change any words you like. Don't change the 'key' words — the
       game uses them to know which move each step is waiting for.
       ------------------------------------------------------------------ */
    steps: [
      { key: 'run',
        text: 'PRESS RIGHT TO RUN',
        tip: 'Just like in the real game. Trust me.',
        praise: 'NICE!' },

      { key: 'jump',
        text: 'PRESS UP TO JUMP',
        tip: 'Grandma can jump. She never mentions it.',
        praise: 'GREAT!' },

      { key: 'slide',
        text: 'PRESS DOWN TO SLIDE',
        tip: 'Her hip has filed a formal complaint.',
        praise: 'OW. HER HIP.' },

      { key: 'shoot',
        text: 'PRESS X TO FIRE YOUR YARN BUSTER',
        tip: 'Grandma has always had a Yarn Buster. Always.',
        praise: 'WHERE DID THAT COME FROM?' },

      { key: 'charge',
        text: 'HOLD X TO CHARGE IT UP, THEN LET GO',
        tip: 'Hold it... hold it... longer... LONGER...',
        praise: 'THAT WAS A WHOLE CARDIGAN.' },

      { key: 'boss',
        text: 'DEFEAT DR. WHISKERS!',
        tip: 'He knocked your good vase off the shelf. On purpose.',
        praise: '' }
    ],

    stageName: 'MEGA GRAN  -  STAGE 1',
    readyText: 'READY',
    quitHint: 'ESC to give up',

    completeTitle: 'TUTORIAL COMPLETE!',
    completeLine: 'None of this will help you.',
    completePrompt: 'Press SPACE to go back',

    // Seconds. How long each bit lasts.
    readySeconds: 2,          // READY flashes this long before you can move
    praiseSeconds: 1.3,       // "NICE!" shows this long before the next step
    completeDelaySeconds: 1.5, // wait this long before SPACE can close the end screen


    /* ------------------------------------------------------------------
       GRANDMA, PLATFORM EDITION
       ------------------------------------------------------------------ */
    floorY: 500,              // how far down the screen the floor is
    startX: 140,              // where she starts, from the left edge
    runSpeed: 300,            // dots per second
    runDistanceNeeded: 260,   // how far she must run right to pass step 1
    jumpSpeed: 680,           // bigger = higher jump
    gravity: 1900,            // bigger = falls back down faster
    slideSpeed: 560,
    slideSeconds: 0.45,


    /* ------------------------------------------------------------------
       THE YARN BUSTER
       ------------------------------------------------------------------ */
    yarnSpeed: 720,           // how fast the yarn flies
    yarnSize: 26,
    chargedYarnSize: 64,
    chargeSeconds: 0.9,       // hold X this long for a charged shot
    chargedDamage: 3,         // a normal shot does 1


    /* ------------------------------------------------------------------
       DR. WHISKERS — the boss. He doesn't fight back. He's a cat.
       ------------------------------------------------------------------ */
    bossName: 'DR. WHISKERS',
    bossEmoji: '😼',
    bossCoat: '#f2f2f2',      // his lab coat
    bossX: 760,
    bossHp: 8,
    bossDropSpeed: 520,       // how fast he falls in from the sky


    /* ------------------------------------------------------------------
       THE LOOK — bright 8-bit colours
       ------------------------------------------------------------------ */
    skyColour: '#3cbcfc',
    towerColour: '#2b9bd9',
    towerWindowColour: '#8ad8fc',
    floorColour: '#b85c1c',
    floorLight: '#f0a860',
    floorDark: '#6c2c00',
    tileSize: 50,
    clouds: 4,
    textColour: '#ffffff',
    praiseColour: '#fce4a0',
    barBack: '#000000',
    granBarColour: '#fce4a0',
    bossBarColour: '#f878f8',
    chargeColours: ['#78f8f8', '#f8f878']
  }

});
