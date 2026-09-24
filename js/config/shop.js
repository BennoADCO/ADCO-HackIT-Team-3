/* ==========================================================================
   CONFIG / SHOP.JS  —  THE COMFORT SHOP
   ==========================================================================

   Prices, and what each upgrade actually does.

   Numbers and words only. See js/config/basics.js for how to change
   things without breaking them.
   ========================================================================== */

var CONFIG = CONFIG || {};   // join the shared settings (the first settings file to load creates it)

Object.assign(CONFIG, {

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
      blurb: 'Playful cats stop getting bored. Everyone feels a bit better.'
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
    toysPlayfulDecay: 0.35,   // Playful cats' health drains at 35% speed
    toysAllDecay: 0.85,       // everyone else at 85%
    loungeAllDecay: 0.6,      // Sun Lounge slows everyone to 60%
    parlourDivaDecay: 0.45,   // Divas calm right down
    parlourRareBoost: 1.45    // magic fur 45% more likely for everyone
  },

});
