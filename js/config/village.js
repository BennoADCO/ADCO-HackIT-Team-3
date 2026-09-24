/* ==========================================================================
   CONFIG / VILLAGE.JS  —  THE LOOK OF THE VILLAGE
   ==========================================================================

   Where the four little shops sit, the colours, the trees and flowers,
   and the welcome screen.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     THE FOUR LITTLE SHOPS
     ------------------------------------------------------------------
     Each one is drawn as a small building with a coloured roof.
     'x' and 'y' are where the building sits on screen.
     ------------------------------------------------------------------ */

  STATIONS: [
    { key: 'spin',  emoji: '🎡', label: 'Spinning Wheel', hint: 'fluff into yarn',
      roof: '#e8836b', x: 132, y: 186 },
    { key: 'knit',  emoji: '🪡', label: 'Knitting Nook',  hint: 'yarn into things',
      roof: '#7fb0e0', x: 768, y: 186 },
    { key: 'sell',  emoji: '🏪', label: 'Market Stall',   hint: 'sell your knitting',
      roof: '#f0b45c', x: 768, y: 436 },
    { key: 'shop',  emoji: '🛋️', label: 'Comfort Shop',   hint: 'spoil the cats',
      roof: '#8fcf72', x: 132, y: 436 }
  ],
  STATION_SIZE: 40,


  /* ------------------------------------------------------------------
     THE LOOK OF THE VILLAGE
     ------------------------------------------------------------------ */

  COLOURS: {
    /* The two greens the lawn is chequered from. Keep them CLOSE together
       — if they are too different the grass looks like a chessboard. */
    grassLight:  '#9cdd6d',
    grassDark:   '#96d868',
    grassEdge:   'rgba(106, 178, 74, 0.5)',

    plaza:       '#f7e7bf',
    plazaEdge:   '#e0c894',

    panel:       '#fffaf0',
    panelSolid:  '#fffaf0',
    panelEdge:   '#e6d1a8',

    hudBar:      '#5d4733',
    hudText:     '#fff6e6',
    ink:         '#5d4733',
    inkSoft:     '#9a8368',
    good:        '#4f9e52',
    coin:        '#f0b429',

    treeTrunk:   '#a5764c',
    treeLeafTop: '#74c554',
    treeLeafLow: '#57ac44'
  },

  // The grass is drawn as a soft checkerboard, like a village life-sim.
  GRASS: {
    tile: 46,
    tuftCount: 110,
    tuftColour: 'rgba(116, 186, 78, 0.65)'
  },

  // The paved square in the middle where the cats live.
  PLAZA: { x: 214, y: 194, w: 472, h: 304 },

  // Trees, drawn by the game rather than loaded from a picture.
  TREES: [
    { x: 132, y: 320, size: 1.0 },
    { x: 768, y: 320, size: 1.0 },
    { x: 296, y: 168, size: 0.82 },
    { x: 450, y: 162, size: 0.9 },
    { x: 604, y: 168, size: 0.82 },
    { x: 60,  y: 545, size: 0.75 },
    { x: 840, y: 545, size: 0.75 }
  ],

  // Little flower patches.
  FLOWERS: [
    { x: 62,  y: 272, colour: '#ff8fb0' },
    { x: 200, y: 272, colour: '#ffd35c' },
    { x: 62,  y: 372, colour: '#ffd35c' },
    { x: 200, y: 372, colour: '#c79bf0' },
    { x: 700, y: 272, colour: '#c79bf0' },
    { x: 838, y: 272, colour: '#ff8fb0' },
    { x: 700, y: 372, colour: '#ff8fb0' },
    { x: 838, y: 372, colour: '#ffd35c' },
    { x: 320, y: 520, colour: '#ffd35c' },
    { x: 450, y: 524, colour: '#ff8fb0' },
    { x: 580, y: 520, colour: '#c79bf0' }
  ],

  // A couple of emoji extras dotted about, just for fun.
  DECORATIONS: [
    { emoji: '🦋', x: 690, y: 330, size: 22 },
    { emoji: '🍄', x: 212, y: 518, size: 22 }
  ],

  /* ------------------------------------------------------------------
     THE WELCOME SCREEN
     ------------------------------------------------------------------
     The front page. 'chips' are the little coloured pills that show the
     loop of the game at a glance.
     ------------------------------------------------------------------ */

  TITLE: {
    chips: [
      { emoji: '🐾', label: 'Groom', fill: '#ffe3ee', edge: '#f2a2c0' },
      { emoji: '🎡', label: 'Spin',  fill: '#ede2ff', edge: '#bda4ef' },
      { emoji: '🪡', label: 'Knit',  fill: '#ddeeff', edge: '#8fc0ea' },
      { emoji: '🪙', label: 'Sell',  fill: '#fff0cf', edge: '#efc55f' }
    ],

    // The big "press space" button.
    buttonColour: '#55b657',
    buttonShadow: '#3d8c41',
    buttonText: 'PRESS SPACE TO PLAY',

    // The Tutorial button beside it (press T, or click it).
    tutorialButtonColour: '#4f86d9',
    tutorialButtonShadow: '#365f9e',
    tutorialButtonText: 'TUTORIAL (T)',
    tutorialButtonEmoji: '🎮',

    // The little triangle bunting strung across the top.
    buntingColours: ['#ff9fb8', '#ffd35c', '#8fd47a', '#8fc4ef', '#c79bf0'],

    // Things that drift gently up the background.
    floaters: ['🧶', '✨', '🐾', '🧵', '🧣', '☁️'],
    floaterCount: 16,

    // The colours of the big title lettering.
    inkFill: '#fff8ec',
    inkOutline: '#5d4733',
    inkShadow: '#f2a2c0'
  },

  // A gentle sunrise-to-sunset tint over the day. Purely decorative.
  DAY_TINT: [
    { at: 0.0,  colour: 'rgba(255, 196, 120, 0.16)' },
    { at: 0.35, colour: 'rgba(255, 255, 255, 0.00)' },
    { at: 0.75, colour: 'rgba(255, 150, 90, 0.13)'  },
    { at: 1.0,  colour: 'rgba(70, 70, 160, 0.28)'   }
  ],

});
