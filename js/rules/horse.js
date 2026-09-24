/* ==========================================================================
   RULES / HORSE.JS  —  THE RANDOM HORSE
   ==========================================================================

   Once a day a horse turns up, stands about, and leaves. It does nothing.
   Nobody knows why it comes. The only rule is that Grandma can't walk
   through it.

   The horse is always in one of five moods (its "phase"):
     'waiting'   — not here yet, counting down to when it arrives
     'arriving'  — ambling in from the edge of the screen
     'standing'  — standing still, doing nothing, occasionally hopping
     'leaving'   — ambling back off the way it came
     'gone'      — left for the day

   The settings for all of this are in js/config/village.js, under HORSE.
   ========================================================================== */

/* Gets a fresh horse ready at the start of every day. */
function resetHorseForDay() {
  var h = CONFIG.HORSE;
  var area = h.standArea;

  /* Pick which side it comes in from: -1 is the left edge, 1 the right. */
  var side = (Math.random() < 0.5) ? -1 : 1;
  var edgeX = (side < 0) ? -60 : CONFIG.CANVAS_WIDTH + 60;

  var spotX = ENGINE.randomBetween(area.left, area.right);
  var spotY = ENGINE.randomBetween(area.top, area.bottom);

  state.horse = {
    phase: 'waiting',
    timer: ENGINE.randomBetween(h.arriveEarliest, h.arriveLatest),

    x: edgeX,             // where it is now (its feet)
    y: spotY,
    edgeX: edgeX,         // where it comes in from, and goes back to
    spotX: spotX,         // where it will stand
    spotY: spotY,

    fidgetTimer: h.fidgetEverySeconds,
    hop: 0,               // how high off the ground it is right now
    step: 0               // ticks along while walking, for the little bounce
  };
}

/* Is the horse on screen right now? */
function isHorseHere() {
  return state.horse &&
         (state.horse.phase === 'arriving' ||
          state.horse.phase === 'standing' ||
          state.horse.phase === 'leaving');
}

/* Walks the horse a little way towards a point. Says true once it's there. */
function walkHorseTowards(targetX, targetY, dt) {
  var horse = state.horse;
  var dx = targetX - horse.x;
  var dy = targetY - horse.y;
  var gap = Math.sqrt(dx * dx + dy * dy);
  var stride = CONFIG.HORSE.walkSpeed * dt;

  horse.step += dt * 8;

  if (gap <= stride) {
    horse.x = targetX;
    horse.y = targetY;
    return true;
  }
  horse.x += (dx / gap) * stride;
  horse.y += (dy / gap) * stride;
  return false;
}

/* Runs every frame while playing. */
function updateHorse(dt) {
  var horse = state.horse;
  var h = CONFIG.HORSE;
  if (!horse) { return; }

  if (horse.phase === 'waiting') {
    horse.timer -= dt;
    if (horse.timer <= 0) { horse.phase = 'arriving'; }
    return;
  }

  if (horse.phase === 'arriving') {
    if (walkHorseTowards(horse.spotX, horse.spotY, dt)) {
      horse.phase = 'standing';
      horse.timer = h.staySeconds;
    }
    return;
  }

  if (horse.phase === 'standing') {
    /* The tiny hop: it jumps up and falls back down over about a third
       of a second, then waits a few seconds before doing it again. */
    horse.fidgetTimer -= dt;
    if (horse.fidgetTimer <= 0) {
      horse.fidgetTimer = h.fidgetEverySeconds * ENGINE.randomBetween(0.7, 1.4);
      horse.hop = 0.35;
    }
    if (horse.hop > 0) { horse.hop -= dt; }

    horse.timer -= dt;
    if (horse.timer <= 0) { horse.phase = 'leaving'; }
    return;
  }

  if (horse.phase === 'leaving') {
    if (walkHorseTowards(horse.edgeX, horse.y, dt)) {
      horse.phase = 'gone';
    }
  }
}

/* How high the horse is lifted off the ground this frame (for drawing). */
function horseLift() {
  var horse = state.horse;
  if (horse.phase === 'standing') {
    if (horse.hop <= 0) { return 0; }
    return Math.sin((horse.hop / 0.35) * Math.PI) * CONFIG.HORSE.fidgetHeight;
  }
  return Math.abs(Math.sin(horse.step)) * 3;   // a gentle clip-clop bounce
}

/* If Grandma has walked into the horse, nudge her back out to its edge.
   Because she's pushed straight away from its middle, she slides round
   it rather than getting stuck. */
function keepGrandmaOutOfHorse() {
  if (!isHorseHere()) { return; }

  var g = state.grandma;
  var dx = g.x - state.horse.x;
  var dy = g.y - state.horse.y;
  var gap = Math.sqrt(dx * dx + dy * dy);
  var bump = CONFIG.HORSE.bumpDistance;

  if (gap >= bump) { return; }

  /* Right on top of each other? Just push her to the left. */
  if (gap < 0.01) { dx = -1; dy = 0; gap = 1; }

  g.x = state.horse.x + (dx / gap) * bump;
  g.y = state.horse.y + (dy / gap) * bump;

  /* The same walls moveGrandma keeps her inside. */
  g.x = ENGINE.clamp(g.x, 44, CONFIG.CANVAS_WIDTH - 44);
  g.y = ENGINE.clamp(g.y, 178, CONFIG.CANVAS_HEIGHT - 76);
}
