/* ==========================================================================
   CONFIG / KNITTING.JS  —  MAGIC FUR, KNITTING AND MEDALS
   ==========================================================================

   What the fur is worth, what Grandma knits, and how the Fashion Show
   scores it all.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

  /* ------------------------------------------------------------------
     RARE FUR
     ------------------------------------------------------------------
     'value' is the money and prestige multiplier. A Galaxy scarf is worth
     eighteen times a plain one, so a single Glowing Diva cat can be worth
     more than the whole rest of the sanctuary.

     'weight' is how likely it is. Bigger = more common. Plain is 100, so
     Galaxy at 1.2 is very rare — until your cats are Glowing.
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

});
