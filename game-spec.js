// create all variable for the game
let ball;
let backG;
let woodBox;
let ringImg;
let thornsImg;
let totalScore = 0;
let gravity = 0.5;
let isGameOver = false;
const heightMax = 400;
let obstacles = [];
let thornsArr = [];
let ringArr = [];
let myPlayer;
// sound variable
let mainSound;
let ringSound;
let jumpSound;
let boxSound;
let gameoverSound;

// setup all the canvas elements.
function preload() {
  // loadImage for all variables
  ball = loadImage("img/ball.png");
  backG = loadImage("img/background.png");
  woodBox = loadImage("img/wood-box.png");
  thornsImg = loadImage("img/thorns.png");
  ringImg = loadImage("img/ring.png");
  soundFormats("mp3", "wav");
  mainSound = loadSound("sound/intermission.mp3");
  ringSound = loadSound("sound/ring-bonus.wav");
  jumpSound = loadSound("sound/jump.wav");
  boxSound = loadSound("sound/wood-break.wav");
  gameoverSound = loadSound("sound/game-over.wav");
}

// create a variable to get the div with class .game-area
const gameArea = document.querySelector(".game-area");
const btnStart = document.querySelector(".start");
const btnRestart = document.querySelector(".restart");
const gameIntroBoard = document.querySelector(".intro-game");
const gameOverBoard = document.querySelector(".gameOver");
const soundOn = document.querySelector(".soundOn");
const soundOff = document.querySelector(".soundOff");
const inst = document.querySelector(".instructions");
const painel = document.querySelector(".painel");

window.onload = () => {
  btnStart.onclick = () => {
    startGame();
    mainSound.loop();
  };
  btnRestart.onclick = () => {
    //isGameOver = false;
    startGame();
    mainSound.loop();
    //draw();
  };
  soundOn.onclick = () => {
    mainSound.stop();
    soundOff.style.display = "block";
    soundOn.style.display = "none";
    // Music start
  };
  soundOff.onclick = () => {
    mainSound.loop();
    soundOn.style.display = "block";
    soundOff.style.display = "none";
    // Music stop
  };
};

function startGame() {
  gameIntroBoard.style.display = "none";
  painel.style.display = "none";
  gameOverBoard.style.display = "none";
  gameArea.style.display = "flex";
  totalScore = 0;
  loop();
}

// Rico Trebeljahr code to correct the velocity
function decayVelocity(vel) {
  // implement decaying velocities
  const decay = vel > 0 ? -0.05 : vel < 0 ? 0.05 : 0;
  vel += decay;
  const overshootFromTop = vel < 0 && decay < 0;
  const overshootFromBot = vel > 0 && decay > 0;
  if (overshootFromTop || overshootFromBot) {
    return 0;
  }
  return vel;
}

function setup() {
  // save the canvas area in a variable to display on html document
  const canvas = createCanvas(900, 500);
  canvas.parent(gameArea);
  // block the game started
  noLoop();
  myPlayer = new playerOne();
  thornsArr.push(new thorns());
  ringArr.push(new ring());
  obstacles.push(new box());
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    jumpSound.play();
    myPlayer.jump();
  }
}

// // Rico Trebeljahr code to correct collision.
// funcao de colisao do circle com o rectang.
function collision2(c, R, withCorrection = true) {
  const nX = max(R.x, min(R.x + R.width, c.pos.x));
  const nY = max(R.y, min(R.y + R.height, c.pos.y));
  const N = createVector(c.pos.x - nX, c.pos.y - nY);

  // actually draw closest point
  // fill("white");
  // circle(nX, nY, 10);

  const Nmag = N.mag();

  const collisionHasOccured = Nmag <= c.radius;

  if (collisionHasOccured && withCorrection) {
    const Nnorm = N.copy().normalize();
    c.pos.add(Nnorm.mult(c.radius - Nmag));
  }

  return collisionHasOccured;
}

// colisao de dois rect

function collision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj2.x < obj1.x + obj1.width &&
    obj1.y < obj2.y + obj2.height &&
    obj1.height + obj1.y > obj2.y
  );
}

function collisionBoxThorns() {
  for (let i = 0; i < obstacles.length; i++) {
    for (let j = 0; j < thornsArr.length; j++) {
      if (collision(obstacles[i], thornsArr[j])) {
        boxSound.play();
        obstacles.splice(obstacles[i], 1);
      }
    }
  }
}

const byCollisionWith = (
  thingToColliding,
  functionToBeExecutedWhenColliding
) => {
  return (obj) => {
    const hit = collision2(thingToColliding, obj, false);
    if (hit) {
      functionToBeExecutedWhenColliding();
      return false;
    }
    return true;
  };
};
const increaseScore = () => {
  totalScore += 25;
  ringSound.play();
};
//funcao fora do ecra

function offscreen(obj) {
  return obj.x === -obj.width;
}

//player class - all elements.
class playerOne {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.pos = createVector(5, 350);
    this.velX = 0;
    this.velY = 0;
    this.radius = this.width / 2;
  }

  jump() {
    if (this.pos.y > 285 - this.height) {
      this.velY = -10;
    }
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.velX -= 0.25;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.velX += 0.25;
    }

    this.velX = decayVelocity(this.velX);
    this.velY = decayVelocity(this.velY);

    this.pos.x += this.velX;
    this.velY += gravity;
    // console.log(this.velY);
    this.pos.y += this.velY;

    obstacles.forEach((obj) => {
      collision2(this, obj);
    });

    ringArr = ringArr.filter(byCollisionWith(this, increaseScore));
    thornsArr = thornsArr.filter(byCollisionWith(this, gameOver));

    const groundLevel = heightMax - this.radius;
    // Max width limits
    this.pos.x = max(1, this.pos.x);
    this.pos.x = min(this.pos.x, width - this.width);
    this.pos.y = max(this.pos.y, this.radius);

    // fix force
    this.pos.y = min(this.pos.y, groundLevel);
    if (this.pos.y === groundLevel && onbox()) {
      gravity = 0;
      this.velY = min(this.velY, 0);
    } else {
      gravity = 0.5;
    }
  }

  draw() {
    fill(180, 30, 60);
    circle(this.pos.x, this.pos.y, this.radius * 2);
    // image(ball, this.pos.x, this.pos.y, this.width, this.height);
  }
}

function onbox() {
  return true;
}
// create obstacle "woodBox"
class box {
  constructor() {
    this.width = 100;
    this.height = 100;
    this.x = width;
    this.y = heightMax - this.height;
  }

  move() {
    this.x -= 7;
  }

  draw() {
    // rect(this.x, this.y, this.width, this.height);
    image(woodBox, this.x, this.y, this.width, this.height);
  }
}

// create enemies "thorns"
class thorns {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = width + this.width * 2;
    this.y = heightMax - this.height;
  }

  move() {
    this.x -= 7;
  }

  draw() {
    image(thornsImg, this.x, this.y, this.width, this.height);
  }
}

class ring {
  constructor() {
    this.width = 40;
    this.height = 90;
    this.x = width + this.width * 2;
    this.y = 280 - this.height;
  }

  move() {
    this.x -= 2;
  }

  draw() {
    image(ringImg, this.x, this.y, this.width, this.height);
  }
}

// function countArray(array){
//     for(let i = 0; i < array.lenght; i++){
//         return array[i];
//     }
// }

// function to draw all elements.
function draw() {
  background(backG);
  collisionBoxThorns();
  const score = document.querySelector(".score span");
  score.innerText = Math.floor(totalScore);
  if (frameCount % 135 === 0) {
    obstacles.push(new box());
  }
  if (frameCount % 100 === 0) {
    thornsArr.push(new thorns());
  }

  if (frameCount % 200 === 0) {
    ringArr.push(new ring());
  }

  //Create multiple thorns
  for (let j = thornsArr.length - 1; j >= 0; j--) {
    thornsArr[j].draw();
    thornsArr[j].move();

    if (offscreen(thornsArr[j])) {
      totalScore += 25;
      thornsArr.splice(j, 1);
    }
  }

  for (let a = ringArr.length - 1; a >= 0; a--) {
    ringArr[a].draw();
    ringArr[a].move();
    if (offscreen(ringArr[a])) {
      ringArr.splice(a, 1);
    }
  }

  //Create multiple box.
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].draw();
    obstacles[i].move();

    if (offscreen(obstacles[i])) {
      totalScore += 5;
      obstacles.splice(i, 1);
    }
  }
  myPlayer.draw();
  myPlayer.move();

  //if(isGameOver === true){
  //   noLoop();
  //}
}

function gameOver() {
  mainSound.stop();
  gameoverSound.play();
  myPlayer.x = 5;
  myPlayer.y = 350;
  noLoop();
  gameOverBoard.style.display = "block";
  gameArea.style.display = "none";
  thornsArr = [];
  obstacles = [];
  const highScore = document.querySelector(".high-score span");
  highScore.innerText = Math.floor(totalScore);
}
