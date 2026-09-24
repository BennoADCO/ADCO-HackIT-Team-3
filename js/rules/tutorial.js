/* ==========================================================================
   RULES / TUTORIAL.JS  —  WHAT HAPPENS IN THE (WRONG) TUTORIAL
   ==========================================================================

   A tiny side-on platform level. Grandma can run, jump, slide and fire
   balls of yarn. The steps in js/config/tutorial.js are shown one at a
   time; each one waits for its move, says "NICE!", then moves on. The
   last step drops in Dr. Whiskers, and hitting him with enough yarn ends
   the tutorial.

   'height' is how far Grandma is above the floor. 0 means standing on it.
   'facing' is 1 for right and -1 for left.
   ========================================================================== */

function startTutorial() {
  state.screen = 'tutorial';
  state.tutorial = {
    time: 0,              // seconds since the tutorial opened
    stepIndex: 0,         // which step we're on (0 = the first one)
    praiseText: '',
    praiseTimer: 0,
    distanceRun: 0,
    finished: false,
    finishedTime: 0,

    gran: {
      x: CONFIG.TUTORIAL.startX,
      height: 0,
      speedUp: 0,
      facing: 1,
      running: false,
      slideTimer: 0,
      chargeTime: 0
    },

    yarn: [],             // the balls of yarn currently flying
    boss: null,           // Dr. Whiskers, once he arrives
    sparks: []            // the burst when he's beaten
  };
}

function currentTutorialStep() {
  return CONFIG.TUTORIAL.steps[state.tutorial.stepIndex] || null;
}


/* ==========================================================================
   EVERY FRAME
   ========================================================================== */

function updateTutorial(dt) {
  var T = CONFIG.TUTORIAL;
  var tut = state.tutorial;
  tut.time += dt;

  if (ENGINE.wasPressed('escape')) {
    state.screen = 'title';
    return;
  }

  updateTutorialSparks(dt);

  if (tut.finished) {
    tut.finishedTime += dt;
    if (tut.finishedTime >= T.completeDelaySeconds && ENGINE.wasPressed(' ', 'enter')) {
      state.screen = 'title';
    }
    return;
  }

  /* Nothing moves while READY is flashing. */
  if (tut.time < T.readySeconds) { return; }

  if (tut.praiseTimer > 0) { tut.praiseTimer -= dt; }

  moveTutorialGran(dt);
  updateYarnBuster(dt);
  updateYarnBalls(dt);
  updateDrWhiskers(dt);
}

/* Called whenever Grandma does a move. If it's the move the current step
   is waiting for, that step is done. Moves made while "NICE!" is still
   showing don't count, so one button press can never skip two steps. */
function tutorialDid(moveKey) {
  var tut = state.tutorial;
  var step = currentTutorialStep();
  if (!step || tut.praiseTimer > 0 || step.key !== moveKey) { return; }

  tut.praiseText = step.praise;
  tut.praiseTimer = CONFIG.TUTORIAL.praiseSeconds;
  tut.stepIndex++;
  ENGINE.sound('buy');
}


/* ==========================================================================
   GRANDMA — RUN, JUMP, SLIDE
   ========================================================================== */

function moveTutorialGran(dt) {
  var T = CONFIG.TUTORIAL;
  var tut = state.tutorial;
  var gran = tut.gran;
  var onFloor = (gran.height === 0);

  gran.running = false;

  if (gran.slideTimer > 0) {
    gran.slideTimer -= dt;
    gran.x += gran.facing * T.slideSpeed * dt;
  } else {
    var direction = 0;
    if (ENGINE.isHeld('arrowleft', 'a')) { direction -= 1; }
    if (ENGINE.isHeld('arrowright', 'd')) { direction += 1; }

    if (direction !== 0) {
      gran.x += direction * T.runSpeed * dt;
      gran.facing = direction;
      gran.running = true;
    }
    if (direction > 0) {
      tut.distanceRun += T.runSpeed * dt;
      if (tut.distanceRun >= T.runDistanceNeeded) { tutorialDid('run'); }
    }

    if (onFloor && ENGINE.wasPressed('arrowup', 'w')) {
      gran.speedUp = T.jumpSpeed;
      ENGINE.sound('jump');
      tutorialDid('jump');
    } else if (onFloor && ENGINE.wasPressed('arrowdown', 's')) {
      gran.slideTimer = T.slideSeconds;
      ENGINE.sound('slide');
      tutorialDid('slide');
    }
  }

  /* Up she goes, and gravity pulls her back down. */
  gran.height += gran.speedUp * dt;
  gran.speedUp -= T.gravity * dt;
  if (gran.height <= 0) {
    gran.height = 0;
    gran.speedUp = 0;
  }

  /* Keep her on screen, and don't let her walk through the boss. */
  var furthestRight = CONFIG.CANVAS_WIDTH - 40;
  if (tut.boss) { furthestRight = tut.boss.x - 90; }
  gran.x = ENGINE.clamp(gran.x, 40, furthestRight);
}


/* ==========================================================================
   THE YARN BUSTER — tap X to fire, hold X to charge
   ========================================================================== */

function updateYarnBuster(dt) {
  var T = CONFIG.TUTORIAL;
  var gran = state.tutorial.gran;

  if (ENGINE.wasPressed('x', ' ')) {
    fireYarn(false);
    gran.chargeTime = 0;
  }

  if (ENGINE.isHeld('x', ' ')) {
    var wasCharged = gran.chargeTime >= T.chargeSeconds;
    gran.chargeTime += dt;
    if (!wasCharged && gran.chargeTime >= T.chargeSeconds) { ENGINE.sound('rare'); }
  } else {
    if (gran.chargeTime >= T.chargeSeconds) { fireYarn(true); }
    gran.chargeTime = 0;
  }
}

function fireYarn(charged) {
  var T = CONFIG.TUTORIAL;
  var gran = state.tutorial.gran;

  state.tutorial.yarn.push({
    x: gran.x + gran.facing * 34,
    y: T.floorY - gran.height - 40,
    speed: gran.facing * T.yarnSpeed,
    charged: charged,
    size: charged ? T.chargedYarnSize : T.yarnSize,
    spin: 0
  });

  ENGINE.sound(charged ? 'bigShoot' : 'shoot');
  tutorialDid('shoot');
  if (charged) { tutorialDid('charge'); }
}

function updateYarnBalls(dt) {
  var T = CONFIG.TUTORIAL;
  var tut = state.tutorial;
  var stillFlying = [];

  for (var i = 0; i < tut.yarn.length; i++) {
    var ball = tut.yarn[i];
    ball.x += ball.speed * dt;
    ball.spin += dt * 12;

    if (hitsDrWhiskers(ball)) {
      tut.boss.hp -= ball.charged ? T.chargedDamage : 1;
      tut.boss.flashTimer = 0.3;
      ENGINE.sound('bossHit');
      if (tut.boss.hp <= 0) { beatDrWhiskers(); }
      continue;
    }

    if (ball.x > -80 && ball.x < CONFIG.CANVAS_WIDTH + 80) {
      stillFlying.push(ball);
    }
  }

  tut.yarn = stillFlying;
}

/* Generous on purpose: anywhere near him counts. */
function hitsDrWhiskers(ball) {
  var boss = state.tutorial.boss;
  if (!boss || !boss.landed || boss.hp <= 0) { return false; }
  var middleY = CONFIG.TUTORIAL.floorY - 60;
  return Math.abs(ball.x - boss.x) < 50 && Math.abs(ball.y - middleY) < 100;
}


/* ==========================================================================
   DR. WHISKERS
   ========================================================================== */

function updateDrWhiskers(dt) {
  var T = CONFIG.TUTORIAL;
  var tut = state.tutorial;
  var step = currentTutorialStep();

  /* He drops in from the sky once the boss step is showing. */
  if (!tut.boss && step && step.key === 'boss' && tut.praiseTimer <= 0) {
    tut.boss = { x: T.bossX, height: CONFIG.CANVAS_HEIGHT, hp: T.bossHp,
                 landed: false, flashTimer: 0 };
  }

  var boss = tut.boss;
  if (!boss) { return; }

  if (boss.flashTimer > 0) { boss.flashTimer -= dt; }

  if (!boss.landed) {
    boss.height -= T.bossDropSpeed * dt;
    if (boss.height <= 0) {
      boss.height = 0;
      boss.landed = true;
      ENGINE.meow(CONFIG.AUDIO.meowBasePitch * 0.6);
    }
  }
}

/* The classic burst: two rings of sparkles flying out in every direction. */
function beatDrWhiskers() {
  var tut = state.tutorial;
  var middleY = CONFIG.TUTORIAL.floorY - 60;
  var sparksPerRing = 12;

  for (var ring = 1; ring <= 2; ring++) {
    for (var n = 0; n < sparksPerRing; n++) {
      var angle = (n / sparksPerRing) * Math.PI * 2;
      tut.sparks.push({
        x: tut.boss.x,
        y: middleY,
        speedX: Math.cos(angle) * 180 * ring,
        speedY: Math.sin(angle) * 180 * ring,
        life: 2
      });
    }
  }

  tut.finished = true;
  tut.finishedTime = 0;
  tut.stepIndex++;
  ENGINE.sound('fanfare');
}

function updateTutorialSparks(dt) {
  var tut = state.tutorial;
  var stillGoing = [];
  for (var i = 0; i < tut.sparks.length; i++) {
    var spark = tut.sparks[i];
    spark.x += spark.speedX * dt;
    spark.y += spark.speedY * dt;
    spark.life -= dt;
    if (spark.life > 0) { stillGoing.push(spark); }
  }
  tut.sparks = stillGoing;
}
