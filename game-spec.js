// create all variable for the game
let ball;
let backG;
let woodBox;
let thornsImg;
let totalScore = 0;
let gravity = 0.5;
let isGameOver = false;
const heightMax = 400;
let obstacles = [];
let thornsArr = [];
let myPlayer;

// create a variable to get the div with class .game-area
const gameArea = document.querySelector(".game-area");
const btnStart = document.querySelector(".start");
const btnRestart = document.querySelector(".restart");
const gameIntroBoard = document.querySelector(".intro-game");
const gameOverBoard = document.querySelector(".gameOver");

window.onload = () => {
  btnStart.onclick = () => {
    startGame();
  };
  btnRestart.onclick = () => {
    //isGameOver = false;
    startGame();
    //draw();
  };
};

function startGame() {
  gameIntroBoard.style.display = "none";
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

// setup all the canvas elements.
function preload() {
  // loadImage for all variables
  ball = loadImage("/img/ball.png");
  backG = loadImage("/img/background.png");
  woodBox = loadImage("/img/wood-box.png");
  thornsImg = loadImage("/img/thorns.png");
}
function setup() {
  // save the canvas area in a variable to display on html document
  const canvas = createCanvas(900, 500);
  canvas.parent(gameArea);
  // block the game started
  noLoop();
  myPlayer = new playerOne();
  obstacles.push(new box());
  thornsArr.push(new thorns());
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    myPlayer.jump();
  }
}
function circleRectCol(circle, rect) {
  const circleDistanceX = Math.abs(circle.x - rect.x);
  const circleDistanceY = Math.abs(circle.y - rect.y);

  if (circleDistanceX > rect.width / 2 + circle.r) {
    return false;
  }
  if (circleDistanceY > rect.height / 2 + circle.r) {
    return false;
  }

  if (circleDistanceX <= rect.width / 2) {
    return true;
  }
  if (circleDistanceY <= rect.height / 2) {
    return true;
  }

  const cornerDistance_sq =
    Math.pow(circleDistanceX - rect.width / 2, 2) +
    Math.pow(circleDistanceY - rect.height / 2, 2);

  return cornerDistance_sq <= Math.pow(circle.r, 2);
}

function colliding2(circle, rect) {
  let cx = circle.x;
  let cy = circle.y;
  let rx = rect.x;
  let ry = rect.y;
  let rw = rect.width;
  let rh = rect.height;
  let testX = cx;
  let testY = cy;
  if (cx < rx) testX = rx;
  // test left edge
  else if (cx > rx + rw) testX = rx + rw; // right edge
  if (cy < ry) testY = ry;
  // top edge
  else if (cy > ry + rh) testY = ry + rh; // bottom edge
  let d = dist(cx, cy, testX, testY);
  if (d <= circle.r) {
    return true;
  }
  return false;
}

function collision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.height + obj1.y > obj2.y
  );
}

function collisionBoxThorns() {
  for (let i = 0; i < obstacles.length; i++) {
    for (let j = 0; j < thornsArr.length; j++) {
      if (collision(obstacles[i], thornsArr[j])) {
        obstacles.push(obstacles[i]);
        thornsArr.splice(thornsArr[j], 1);
      }
    }
  }
}

function offscreen(obj) {
  return obj.x === -obj.width;
}

//player class - all elements.
class playerOne {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 5;
    this.y = 350;
    this.velX = 0;
    this.velY = 0;
    this.r = this.width / 2;
  }

  jump() {
    if (this.y > 285 - this.height) {
      this.velY = -10;
    }
  }

  //movements ball
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.velX -= 0.25;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.velX += 0.25;
    }

    this.velX = decayVelocity(this.velX);
    this.velY = decayVelocity(this.velY);

    this.x += this.velX;
    this.velY += gravity;
    this.y += this.velY;
    console.log(obstacles);
    const weColliding = obstacles.find((obj) => {
      return colliding2(myPlayer, obj);
    });

    console.log(weColliding);
    if (weColliding) {
      //   this.x -= this.velX;
      //   this.y -= this.velY;
    }

    // Max width limits
    this.x = max(1, this.x);
    this.x = min(this.x, width - this.width - 1);
    this.y = max(this.y, 0 + this.height + 1);
    this.y = min(this.y, heightMax - this.height - 1);
  }

  draw() {
    image(ball, this.x, this.y, this.width, this.height);
  }
}

// create obstacle "woodBox"
class box {
  constructor() {
    this.width = 100;
    this.height = 100;
    this.x = width;
    this.y = heightMax - this.height;
    this.velX = 0;
  }

  move() {
    this.x -= 2;
    totalScore += 0.01;
  }

  draw() {
    rect(this.x, this.y, this.width, this.height);
    // image(woodBox, this.x, this.y, this.width, this.height);
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
    this.x -= 2;
  }

  draw() {
    image(thornsImg, this.x, this.y, this.width, this.height);
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
  myPlayer.draw();
  myPlayer.move();
  collisionBoxThorns();
  const score = document.querySelector(".score span");
  score.innerText = Math.floor(totalScore);
  if (frameCount % 450 === 0) {
    obstacles.push(new box());
  }
  if (frameCount % 650 === 0) {
    thornsArr.push(new thorns());
  }

  //Create multiple thorns
  for (let j = thornsArr.length - 1; j >= 0; j--) {
    thornsArr[j].draw();
    thornsArr[j].move();

    if (colliding2(myPlayer, thornsArr[j])) {
      //isGameOver = true;
      noLoop();
      gameOver();
      return;
    }
    if (offscreen(thornsArr[j])) {
      totalScore += 25;
      thornsArr.splice(j, 1);
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

  //if(isGameOver === true){
  //   noLoop();
  //}
}

function gameOver() {
  gameOverBoard.style.display = "block";
  gameArea.style.display = "none";
  myPlayer.x = 5;
  myPlayer.y = 350;
  thornsArr = [];
  obstacles = [];
  const highScore = document.querySelector(".high-score span");
  highScore.innerText = Math.floor(totalScore);
}
