/* ==========================================================================
   CONFIG.JS  —  THE SETTINGS FILE
   ==========================================================================

   This file is nothing but numbers and words. There is no "code" here in
   the scary sense — nothing happens in this file, it just writes down what
   the game should use.

   THIS IS THE FILE TO CHANGE if you want the game to feel different.
   Want Grandma to walk faster? Change GRANDMA.speed.
   Want days to be shorter? Change DAY_LENGTH_SECONDS.
   Want the cats named after people in the office? Change STARTING_CATS.

   HOW TO CHANGE SOMETHING:
     1. Find the line.  2. Change the number or the text inside the quotes.
     3. Save the file.  4. Press F5 in the browser.

   TWO RULES SO YOU DON'T BREAK IT:
     - Text always sits inside 'single quotes'. Numbers never do.
     - Every line ends in a comma, except the last one in a group.

   ========================================================================== */

var CONFIG = {

  /* ------------------------------------------------------------------
     THE BASICS
     ------------------------------------------------------------------ */

  GAME_TITLE: "Grandma's Purradise",
  GAME_SUBTITLE: 'Fluff in. Fashion out.',

  // The picture is always this many dots across and down. The browser
  // stretches it to fit the window, so don't worry about screen sizes.
  CANVAS_WIDTH: 900,
  CANVAS_HEIGHT: 600,

  // How long a single day lasts, in seconds, and how many days in a season.
  DAY_LENGTH_SECONDS: 90,
  DAYS_IN_SEASON: 5,


  /* ------------------------------------------------------------------
     GRANDMA — the character you control
     ------------------------------------------------------------------
     She is drawn as a proper little character: a round head with a chunky
     body underneath, in the style of a village life-sim. The head is an
     emoji; everything below the neck is drawn by the game.
     ------------------------------------------------------------------ */

  GRANDMA: {
    emoji: '👵',
    headSize: 46,        // how big her head is drawn, in dots
    bodyWidth: 36,
    bodyHeight: 34,
    bodyColour: '#e88aa8',    // her cardigan
    trimColour: '#fff1e0',    // her apron / pinny
    speed: 270,          // dots she travels per second. Higher = faster.
    reach: 82,           // how close she must get to use a cat or a building
    startX: 450,
    startY: 360
  },


  /* ------------------------------------------------------------------
     THE WORK — how long each job takes and how much it produces
     ------------------------------------------------------------------ */

  // Seconds Grandma spends on each job. She can't move while working.
  GROOM_SECONDS: 0.85,
  SPIN_SECONDS: 1.1,
  KNIT_SECONDS: 1.4,
  SELL_SECONDS: 0.9,

  // The processing chain. Fluff becomes yarn, yarn becomes a product.
  FLUFF_PER_YARN: 3,      // 3 balls of fluff make 1 ball of yarn
  YARN_PER_PRODUCT: 2,    // 2 balls of yarn make 1 knitted thing

  // Mood a cat gains when you groom it, before its personality is applied.
  GROOM_MOOD_BONUS: 14,

  // Cats sleep well. Every cat wakes up this much happier each morning.
  OVERNIGHT_MOOD_RECOVERY: 22,


  /* ------------------------------------------------------------------
     CAT MOOD
     ------------------------------------------------------------------
     Mood runs from 0 (thoroughly unimpressed) to 100 (blissful).
     It slowly drips downwards unless you look after them.

     'fluffValue'  multiplies how much fluff you get.
     'rareChance'  multiplies the odds of magical fur (see RARITIES below).
     ------------------------------------------------------------------ */

  MOOD_TIERS: [
    { name: 'Grumpy',   emoji: '😾', min: 0,  colour: '#ef7a6a', fluffValue: 0.5, rareChance: 0.25 },
    { name: 'Content',  emoji: '😺', min: 30, colour: '#f4c95d', fluffValue: 1.0, rareChance: 1.0  },
    { name: 'Happy',    emoji: '😸', min: 62, colour: '#7fcf6b', fluffValue: 1.5, rareChance: 2.2  },
    { name: 'Blissful', emoji: '😻', min: 88, colour: '#b98bff', fluffValue: 2.0, rareChance: 4.0  }
  ],

  // How fast mood drips away, in mood-points per second, before personality.
  MOOD_DECAY_PER_SECOND: 2.4,

  // How fast a cat regrows its fluff, in seconds for a full coat.
  FLUFF_REGROW_SECONDS: 9,


  /* ------------------------------------------------------------------
     PERSONALITIES
     ------------------------------------------------------------------
     Every cat has one. This is where the character comes from.

     moodDecay     1 is normal. 2 means it gets grumpy twice as fast.
     fluffPerGroom how many balls of fluff a single grooming gives
     regrowSpeed   1 is normal. 0.5 means its coat takes twice as long.
     groomJoy      1 is normal. 2 means grooming cheers it up twice as much.
     rareBonus     1 is normal. 2 means twice as likely to grow magic fur.
     ------------------------------------------------------------------ */

  PERSONALITIES: {
    lazy: {
      name: 'Lazy', emoji: '😴',
      blurb: 'Enormous coat. Cannot be hurried.',
      moodDecay: 0.5, fluffPerGroom: 2, regrowSpeed: 0.55, groomJoy: 1.0, rareBonus: 1.0
    },
    playful: {
      name: 'Playful', emoji: '🧸',
      blurb: 'Gets bored fast. Buy the Toy Basket.',
      moodDecay: 2.0, fluffPerGroom: 1, regrowSpeed: 1.2, groomJoy: 1.2, rareBonus: 1.2
    },
    diva: {
      name: 'Diva', emoji: '💅',
      blurb: 'Grows the finest fur. Knows it.',
      moodDecay: 1.9, fluffPerGroom: 1, regrowSpeed: 1.0, groomJoy: 1.0, rareBonus: 2.6
    },
    curious: {
      name: 'Curious', emoji: '🔍',
      blurb: 'Cheers up whenever Grandma is nearby.',
      moodDecay: 1.0, fluffPerGroom: 1, regrowSpeed: 1.1, groomJoy: 1.0, rareBonus: 1.3
    },
    mischievous: {
      name: 'Mischievous', emoji: '😼',
      blurb: 'Fast-growing coat. Occasionally steals yarn.',
      moodDecay: 1.1, fluffPerGroom: 1, regrowSpeed: 1.6, groomJoy: 1.1, rareBonus: 1.1
    },
    affectionate: {
      name: 'Affectionate', emoji: '🥰',
      blurb: 'A cuddle goes a very long way.',
      moodDecay: 1.2, fluffPerGroom: 1, regrowSpeed: 1.0, groomJoy: 2.4, rareBonus: 1.0
    }
  },

  // How close Grandma must be for a Curious cat to perk up, and how much
  // mood per second it gains while she's there.
  CURIOUS_RANGE: 130,
  CURIOUS_MOOD_PER_SECOND: 4,

  // A mischievous cat tries to pinch a ball of yarn this often (seconds).
  MISCHIEF_EVERY_SECONDS: 26,


  /* ------------------------------------------------------------------
     THE CATS THEMSELVES
     ------------------------------------------------------------------
     >>> THIS IS THE FUN ONE TO EDIT. <<<
     Rename these after people in the office.

     'emoji'  is the cat's face.
     'colour' is the colour of its little body.
     Keep the personality names spelled exactly as in PERSONALITIES above.
     ------------------------------------------------------------------ */

  STARTING_CATS: [
    { name: 'Biscuit',   emoji: '🐱', colour: '#f2c384', personality: 'lazy' },
    { name: 'Duchess',   emoji: '😻', colour: '#fbf0e2', personality: 'diva' },
    { name: 'Pickles',   emoji: '😼', colour: '#b6b0ab', personality: 'mischievous' },
    { name: 'Bobbin',    emoji: '😺', colour: '#f0a15c', personality: 'affectionate' }
  ],

  // The pool that adopted cats are drawn from, in order.
  ADOPTABLE_CATS: [
    { name: 'Marmalade', emoji: '🐈', colour: '#f3a552', personality: 'playful' },
    { name: 'Purlie',    emoji: '😽', colour: '#d8c3e8', personality: 'curious' },
    { name: 'Crumpet',   emoji: '😸', colour: '#e8d2a8', personality: 'lazy' },
    { name: 'Tinsel',    emoji: '😻', colour: '#cfe4f2', personality: 'diva' },
    { name: 'Noodle',    emoji: '🐱', colour: '#f7ddc2', personality: 'playful' },
    { name: 'Waffle',    emoji: '😺', colour: '#d9a870', personality: 'affectionate' },
    { name: 'Socks',     emoji: '😼', colour: '#9aa3a8', personality: 'mischievous' },
    { name: 'Casta',     emoji: '🐈', colour: '#c9b39a', personality: 'curious' }
  ],

  // The patch of ground the cats wander around in.
  // These numbers are where their FEET go, not their heads.
  CAT_AREA: { left: 256, right: 644, top: 230, bottom: 454 },

  CAT: {
    headSize: 40,
    bodyWidth: 30,
    bodyHeight: 21
  },

  CAT_WANDER_SPEED: 26,       // dots per second — slow and pottering
  CAT_PAUSE_SECONDS: 2.5,     // how long a cat sits still between strolls
  CAT_MINIMUM_GAP: 88,        // how far apart the game keeps them


  /* ------------------------------------------------------------------
     RARE FUR
     ------------------------------------------------------------------
     'value' is the money and prestige multiplier. A Galaxy scarf is worth
     eighteen times a plain one, so a single blissful Diva cat can be worth
     more than the whole rest of the sanctuary.

     'weight' is how likely it is. Bigger = more common. Plain is 100, so
     Galaxy at 1.2 is very rare — until your cats are blissful.
     ------------------------------------------------------------------ */

  RARITIES: [
    { key: 'plain',   name: 'Plain',   emoji: '🧶', colour: '#d8ab7e', value: 1,  weight: 100 },
    { key: 'glitter', name: 'Glitter', emoji: '✨', colour: '#ffd24a', value: 3,  weight: 20  },
    { key: 'rainbow', name: 'Rainbow', emoji: '🌈', colour: '#ff87bd', value: 6,  weight: 8   },
    { key: 'glow',    name: 'Glow',    emoji: '💫', colour: '#6fe8c0', value: 10, weight: 3.5 },
    { key: 'galaxy',  name: 'Galaxy',  emoji: '🌌', colour: '#a98bff', value: 18, weight: 1.2 }
  ],


  /* ------------------------------------------------------------------
     WHAT GRANDMA KNITS
     ------------------------------------------------------------------
     'base' is what a plain one sells for. Multiply by the fur's value for
     the real price — a Galaxy Blanket is 30 x 18 = 540.
     ------------------------------------------------------------------ */

  PRODUCTS: [
    { name: 'Scarf',      emoji: '🧣', base: 18 },
    { name: 'Socks',      emoji: '🧦', base: 14 },
    { name: 'Mittens',    emoji: '🧤', base: 16 },
    { name: 'Bobble Hat', emoji: '🧢', base: 20 },
    { name: 'Cardigan',   emoji: '👚', base: 26 },
    { name: 'Tea Cosy',   emoji: '🫖', base: 22 },
    { name: 'Blanket',    emoji: '🛏️', base: 30 }
  ],


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
     THE COMFORT SHOP
     ------------------------------------------------------------------
     Press the number key while standing at the shop to buy.
     The first three can only be bought once. Adopting is unlimited but
     gets more expensive each time.
     ------------------------------------------------------------------ */

  SHOP_ITEMS: [
    {
      key: 'toys', emoji: '🧸', name: 'Toy Basket', cost: 40,
      blurb: 'Playful cats stop getting bored. Everyone cheers up a bit.'
    },
    {
      key: 'lounge', emoji: '🛏️', name: 'Sun Lounge', cost: 75,
      blurb: 'Every cat stays happy for much longer.'
    },
    {
      key: 'parlour', emoji: '💅', name: 'Grooming Parlour', cost: 120,
      blurb: 'Divas are delighted. Magic fur becomes more common.'
    },
    {
      key: 'adopt', emoji: '🐾', name: 'Adopt a Cat', cost: 90,
      blurb: 'One more cat joins the sanctuary.'
    }
  ],

  // Each cat you adopt costs this much more than the last one.
  ADOPT_COST_INCREASE: 55,

  // What the upgrades actually do.
  UPGRADE_EFFECTS: {
    toysPlayfulDecay: 0.35,   // Playful cats' mood drains at 35% speed
    toysAllDecay: 0.85,       // everyone else at 85%
    loungeAllDecay: 0.6,      // Sun Lounge slows everyone to 60%
    parlourDivaDecay: 0.45,   // Divas calm right down
    parlourRareBoost: 1.45    // magic fur 45% more likely for everyone
  },


  /* ------------------------------------------------------------------
     THE FASHION SHOW — how you are scored at the end
     ------------------------------------------------------------------ */

  MEDALS: [
    { name: 'A Lovely Effort, Dear', emoji: '🫖', min: 0 },
    { name: 'Bronze Bobbin',         emoji: '🥉', min: 350 },
    { name: 'Silver Stitch',         emoji: '🥈', min: 800 },
    { name: 'Gold Needle',           emoji: '🥇', min: 1600 },
    { name: 'MASTER KNITTER',        emoji: '🏆', min: 3000 }
  ],

  // How many of your finest pieces get shown on the results screen.
  SHOWCASE_COUNT: 5,


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


  /* ------------------------------------------------------------------
     SOUND
     ------------------------------------------------------------------
     Every sound here is generated by the browser from scratch — there are
     no music files. Turn the volumes down to 0 to silence them.
     ------------------------------------------------------------------ */

  AUDIO: {
    masterVolume: 0.85,
    musicVolume: 0.16,
    sfxVolume: 0.32,
    musicOn: true,

    // How long each note of the background music lasts, in seconds.
    // Bigger number = slower, sleepier music.
    noteSeconds: 0.46,

    // The cosy loop. Four bars, four notes each. Change the note names if
    // you fancy a different tune — 'C4' is middle C, 'C3' is an octave down.
    musicBars: [
      { bass: 'C3', notes: ['C4', 'E4', 'G4', 'E4'] },
      { bass: 'A2', notes: ['A3', 'C4', 'E4', 'C4'] },
      { bass: 'F2', notes: ['F3', 'A3', 'C4', 'A3'] },
      { bass: 'G2', notes: ['G3', 'B3', 'D4', 'B3'] }
    ],

    /* --- MEOWS IN THE MUSIC ------------------------------------------
       The cats sing along with the tune. A meow is dropped in on every
       'meowEveryNotes'th note of the music, pitched to match the melody.

         meowEveryNotes: 2  = a meow every other note (very meowy)
         meowEveryNotes: 4  = one meow per bar (the default)
         meowEveryNotes: 8  = one meow every two bars (calmer)
         meowsInMusic: false = no singing cats at all
       ------------------------------------------------------------------ */
    meowsInMusic: true,
    meowEveryNotes: 4,
    meowStartsOnNote: 2,
    musicMeowVolume: 0.34,
    musicMeowPitch: 2.1,       // how high the singing cats are. 2 = one octave up

    // Random background meows from around the village, in seconds.
    ambientMeowSeconds: 11,
    meowBasePitch: 560
  },


  /* ------------------------------------------------------------------
     WORDS ON SCREEN
     ------------------------------------------------------------------ */

  TEXT: {
    startPrompt: 'Press SPACE to open the gates',
    controls: 'Arrow keys or W A S D to walk  ·  SPACE to use  ·  M for music',
    dayEndPrompt: 'Press SPACE for the next day',
    showPrompt: 'Press R to run the season again',
    needFluff: 'Groom a cat with a ☁️ above its head',
    needSpin: 'Take your fluff to the 🎡 Spinning Wheel',
    needKnit: 'Take your yarn to the 🪡 Knitting Nook',
    needSell: 'Take your knitting to the 🏪 Market Stall',
    needShop: 'Spend your coins at the 🛋️ Comfort Shop',
    waiting: 'The coats are growing back — go and say hello to someone'
  }

};
