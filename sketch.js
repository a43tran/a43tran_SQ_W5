// ============================================================
// Side Quest Week 5
// ============================================================

const SPRITE = {
  frameWidth:  75,
  frameHeight: 150,
  numFrames:   4,
  animSpeed:   20,
  scale:       0.5,
  rows: {
    down:  0,
    up:    1,
    right: 2,
    left:  3,
  },
  offsets: {
    down:  { x: 0, y: 0  },
    up:    { x: 0, y: 0  },
    right: { x: .1, y: 10 },
    left:  { x: 2.2, y: 20 },
  },
};

const HEART = {
  frameWidth:  32,
  frameHeight: 32,
  numFrames:   8,
  animSpeed:   6,
  scale:       1.5,
};

const TILE_SIZE = 50;

const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 3, 1, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 3, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const TILE_COLORS = {
  0: [163, 212, 108], // floor 
  1: [27, 125, 76  ], // wall  
  2: [163, 212, 108], // start 
  3: [163, 212, 108], // coin 
  4: [247, 205, 64 ], // exit 
};

let player = {
  x: 0,
  y: 0,
  speed: 6,

  currentFrame: 0,
  frameTimer:   0,
  direction:    "down",
  isMoving:     false,

  hw: 12, 
  hh: 12, 
};

let hearts = [];
let heartsCollected = 0;
let gameWon = false;
let characterSheet;
let heartSheet;
let bgImage;

function preload() {
  characterSheet = loadImage("assets/images/walking.png");
  heartSheet     = loadImage("assets/images/hearts.png");
  bgImage        = loadImage("assets/images/bg.jpg");
}

function setup() {
  createCanvas(TILE_SIZE * MAZE[0].length, TILE_SIZE * MAZE.length);
  imageMode(CENTER);

  for (let row = 0; row < MAZE.length; row++) {
    for (let col = 0; col < MAZE[row].length; col++) {
      let tile = MAZE[row][col];

      if (tile === 2) {
        player.x = col * TILE_SIZE + TILE_SIZE / 2;
        player.y = row * TILE_SIZE + TILE_SIZE / 2;
      }

      if (tile === 3) {
        hearts.push({
          x:          col * TILE_SIZE + TILE_SIZE / 2,
          y:          row * TILE_SIZE + TILE_SIZE / 2,
          frame:      floor(random(HEART.numFrames)),
          frameTimer: 0,
          collected:  false,
        });
      }
    }
  }
}

function draw() {
  background(bgImage);

  drawMaze();
  updateHearts();
  drawHearts();
  handleInput();
  resolveWallCollisions();
  checkHeartCollection();
  checkExit();
  animateSprite();
  drawCharacter();
  drawHUD();

  if (gameWon) {
    drawWinScreen();
  }
}

function drawMaze() {
  rectMode(CORNER);
  noStroke();

  for (let row = 0; row < MAZE.length; row++) {
    for (let col = 0; col < MAZE[row].length; col++) {
      let tile = MAZE[row][col];

      if (tile === 4) {
        if (heartsCollected === hearts.length) {
          fill(247, 205, 64); 
        } else {
          fill(219, 153, 29);  
        }
      } else {
        let c = TILE_COLORS[tile];
        fill(c[0], c[1], c[2]);
      }

      rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      
      if (tile === 4) {
        if (heartsCollected === hearts.length) {
          fill(255);
     } else {
        fill(140, 96, 14);
      }

      textAlign(CENTER, CENTER);
      textSize(32);
      textStyle(BOLD);
      text("?", col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2);
    }

    }
  }
}

function updateHearts() {
  for (let i = 0; i < hearts.length; i++) {
    if (hearts[i].collected) continue; // skip collected hearts

    hearts[i].frameTimer++;
    if (hearts[i].frameTimer >= HEART.animSpeed) {
      hearts[i].frameTimer = 0;
      hearts[i].frame = (hearts[i].frame + 1) % HEART.numFrames;
    }
  }
}

function drawHearts() {
  for (let i = 0; i < hearts.length; i++) {
    if (hearts[i].collected) continue; 

    let heart = hearts[i];

    let sx = heart.frame * HEART.frameWidth;
    let dw = HEART.frameWidth  * HEART.scale;
    let dh = HEART.frameHeight * HEART.scale;

    image(heartSheet, heart.x, heart.y, dw, dh, sx, 0, HEART.frameWidth, HEART.frameHeight);
  }
}

function handleInput() {
  if (gameWon) return;

  player.isMoving = false;

  if (keyIsDown(87)) { 
    player.y -= player.speed;
    player.direction = "up";
    player.isMoving = true;
  }
  if (keyIsDown(83)) { 
    player.y += player.speed;
    player.direction = "down";
    player.isMoving = true;
  }
  if (keyIsDown(65)) { 
    player.x -= player.speed;
    player.direction = "left";
    player.isMoving = true;
  }
  if (keyIsDown(68)) { 
    player.x += player.speed;
    player.direction = "right";
    player.isMoving = true;
  }
}

function resolveWallCollisions() {
  let corners = [
    { x: player.x - player.hw, y: player.y - player.hh }, 
    { x: player.x + player.hw, y: player.y - player.hh }, 
    { x: player.x - player.hw, y: player.y + player.hh }, 
    { x: player.x + player.hw, y: player.y + player.hh },
  ];

  for (let i = 0; i < corners.length; i++) {
    let c = corners[i];

    let col = floor(c.x / TILE_SIZE);
    let row = floor(c.y / TILE_SIZE);

    if (row < 0 || row >= MAZE.length || col < 0 || col >= MAZE[0].length) continue;

    if (MAZE[row][col] === 1) {
      let tileLeft   = col * TILE_SIZE;
      let tileRight  = tileLeft + TILE_SIZE;
      let tileTop    = row * TILE_SIZE;
      let tileBottom = tileTop + TILE_SIZE;

      let overlapLeft   = (player.x + player.hw) - tileLeft;
      let overlapRight  = tileRight  - (player.x - player.hw);
      let overlapTop    = (player.y + player.hh) - tileTop;
      let overlapBottom = tileBottom - (player.y - player.hh);

      let minOverlap = min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if      (minOverlap === overlapLeft)   player.x -= overlapLeft;
      else if (minOverlap === overlapRight)  player.x += overlapRight;
      else if (minOverlap === overlapTop)    player.y -= overlapTop;
      else if (minOverlap === overlapBottom) player.y += overlapBottom;
    }
  }
}

function checkHeartCollection() {
  for (let i = 0; i < hearts.length; i++) {
    if (hearts[i].collected) continue;

    let d = dist(player.x, player.y, hearts[i].x, hearts[i].y);
    if (d < TILE_SIZE * 0.6) {
      hearts[i].collected = true;
      heartsCollected++;
    }
  }
}

function checkExit() {
  if (heartsCollected < hearts.length) return; 

  for (let row = 0; row < MAZE.length; row++) {
    for (let col = 0; col < MAZE[row].length; col++) {
      if (MAZE[row][col] === 4) {
        let exitX = col * TILE_SIZE + TILE_SIZE / 2;
        let exitY = row * TILE_SIZE + TILE_SIZE / 2;
        if (dist(player.x, player.y, exitX, exitY) < TILE_SIZE * 0.6) {
          gameWon = true;
        }
      }
    }
  }
}

function animateSprite() {
  if (player.isMoving) {
    player.frameTimer++;

    if (player.frameTimer >= SPRITE.animSpeed) {
      player.frameTimer = 0;
      player.currentFrame = (player.currentFrame + 1) % SPRITE.numFrames;
    }
  } else {
    player.currentFrame = 0;
    player.frameTimer   = 0;
  }
}

function drawCharacter() {
  let row    = SPRITE.rows[player.direction];
  let offset = SPRITE.offsets[player.direction];

  let sx = (player.currentFrame * SPRITE.frameWidth)  + offset.x;
  let sy = (row                 * SPRITE.frameHeight) + offset.y;

  let dw = SPRITE.frameWidth  * SPRITE.scale;
  let dh = SPRITE.frameHeight * SPRITE.scale;

  image(characterSheet, player.x, player.y, dw, dh, sx, sy, SPRITE.frameWidth, SPRITE.frameHeight);
}

function drawHUD() {
  noStroke();
  fill(255);
  textSize(14);
  textAlign(CENTER);
  textStyle(NORMAL);
  textFont("monospace");
  text("HEARTS: " + heartsCollected + " / " + hearts.length, 105, 20);
  textStyle(BOLD);

  let tw = textWidth("SUPER MARIO MAZE: FIND LOVE");
  let th = 20;
  let padding = 50;

  fill(218, 153, 29);
  rectMode(CENTER);
  rect(width / 2, 20, tw + padding, th, 5);
  fill(255);
  text("SUPER MARIO MAZE: FIND LOVE", width / 2, 20);

  if (heartsCollected === hearts.length) {
    fill(189, 255, 122);
    textAlign(LEFT);
    textStyle(NORMAL);
    text("Exit is open! Find the blue tile.", 50, 40);
  }
}

function drawWinScreen() {
  imageMode(CENTER);
  image(bgImage, width / 2, height / 2, width, height);
  filter(BLUR, 5);


  rectMode(CENTER);
  fill(247, 205, 64)
  rect(width / 2, height / 2, 600, 200, 10);


  fill(255);
  textAlign(CENTER);
  textSize(64);
  textStyle(BOLD);
  stroke(14, 85, 156);
  strokeWeight(6);
  text("YOU ESCAPED!", width / 2, height / 2 - 20);

  textSize(20);
  fill(14, 85, 156);
  noStroke();
  textStyle(BOLD);
  text("Mario has found love with all hearts collected!", width / 2, height / 2 + 30);
}
