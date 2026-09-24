/* ==========================================================================
   RULES / SHOP.JS  —  THE COMFORT SHOP
   ==========================================================================

   Buying upgrades and adopting cats with the number keys.
   ========================================================================== */

function tryToBuy(index) {
  var item = CONFIG.SHOP_ITEMS[index];
  if (!item) { return; }

  var cost = (item.key === 'adopt') ? state.adoptCost : item.cost;

  if (item.key !== 'adopt' && state.upgrades[item.key]) {
    say('You already have the ' + item.name + '.');
    ENGINE.sound('deny');
    return;
  }

  if (state.coins < cost) {
    say('Not enough coins — the ' + item.name + ' costs ' + cost + '.');
    ENGINE.sound('deny');
    return;
  }

  state.coins -= cost;
  ENGINE.sound('buy');

  if (item.key === 'adopt') {
    var recipe = CONFIG.ADOPTABLE_CATS[state.nextAdoptIndex % CONFIG.ADOPTABLE_CATS.length];
    state.nextAdoptIndex++;
    var cat = makeCat(recipe);
    state.cats.push(cat);
    state.adoptCost += CONFIG.ADOPT_COST_INCREASE;
    ENGINE.meow(CONFIG.AUDIO.meowBasePitch * 1.15);
    say(cat.emoji + ' ' + cat.name + ' the ' + cat.personality.name +
        ' cat has moved in! ' + cat.personality.blurb);
    sparkle(cat.x, cat.y, '#ffd24a');
  } else {
    state.upgrades[item.key] = true;
    say(item.emoji + ' ' + item.name + ' installed. ' + item.blurb);
    /* Every cat is immediately a bit healthier thanks to the new thing. */
    for (var i = 0; i < state.cats.length; i++) {
      state.cats[i].health = ENGINE.clamp(state.cats[i].health + CONFIG.SHOP_HEALTH_BONUS, 0, 100);
    }
  }
}

/* The cheapest thing still for sale. The hint bar uses this. */
function cheapestShopCost() {
  var cheapest = Infinity;
  for (var i = 0; i < CONFIG.SHOP_ITEMS.length; i++) {
    var item = CONFIG.SHOP_ITEMS[i];
    if (item.key === 'adopt') {
      cheapest = Math.min(cheapest, state.adoptCost);
    } else if (!state.upgrades[item.key]) {
      cheapest = Math.min(cheapest, item.cost);
    }
  }
  return cheapest;
}
