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
let mainSound;
let ringSound;
let jumpSound;

// create a variable to get the div with class .game-area
const gameArea = document.querySelector(".game-area");
const btnStart = document.querySelector(".start");
const btnRestart = document.querySelector(".restart");
const gameIntroBoard = document.querySelector(".intro-game");
const gameOverBoard = document.querySelector(".gameOver");
const soundOn = document.querySelector(".soundOn");
const soundOff = document.querySelector(".soundOff");
const inst = document.querySelector(".instructions");

window.onload = () => {
  btnStart.onclick = () => {
    startGame();
  };
  btnRestart.onclick = () => {
    //isGameOver = false;
    startGame();
    //draw();
  };
  inst.onclick = () => {
    //Painel de instruçoes
  };

  soundOn.onclick = () => {
    soundOff.style.display = "block";
    soundOn.style.display = "none";
    // Music start
  };
  soundOff.onclick = () => {
    soundOn.style.display = "block";
    soundOff.style.display = "none";
    // Music stop
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
  ball = loadImage("img/ball.png");
  backG = loadImage("img/background.png");
  woodBox = loadImage("img/wood-box.png");
  thornsImg = loadImage("img/thorns.png");
  ringImg = loadImage("img/ring.png");
  mainSound = loadSound("sound/intermission.mp3");
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
  ringArr.push(new ring());
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    myPlayer.jump();
  }
}

// // funcao de colisao do circle com o rectang.
// function colliding2(c, R) {
//   const nX = max(R.x, min(R.x + R.width, c.x));
//   const nY = max(R.y, min(R.y + R.height, c.y));
//   const N = createVector(c.x - nX, c.y - nY);
//   //   console.log(R.x);
//   fill("white");
//   circle(nX, nY, 10);
//   const Nmag = N.mag();

//   const collisionHasOccured = Nmag <= c.radius;

//   if (collisionHasOccured) {
//     const Nnorm = N.copy().normalize();
//     c.add(Nnorm.mult(c.radius - Nmag));
//   }
// }
// function colliding2(circle, rect) {
//   let cx = circle.x;
//   let cy = circle.y;
//   //   let cw = circle.width;
//   let rx = rect.x;
//   let ry = rect.y;
//   let rw = rect.width;
//   let rh = rect.height;
//   let testX = cx;
//   let testY = cy;

//   // which edge is closest?
//   if (cx < rx) {
//     testX = rx;
//   }
//   // test left edge
//   else if (cx > rx + rw) {
//     testX = rx + rw;
//   } // right edge
//   if (cy < ry) {
//     testY = ry;
//   }
//   // top edge
//   else if (cy > ry + rh) {
//     testY = ry + rh;
//   } // bottom edge

//   // get distance from closest edges
//   const distX = cx - testX;
//   const distY = cy - testY;
//   const distance = Math.abs(distX * distX + distY * distY);

//   // if the distance is less than the radius, collision!
//   if (distance <= circle.r) {
//     console.log("hit");
//     return true;
//   }
//   return false;
// }

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
        obstacles.push(obstacles[i]);
        thornsArr.splice(thornsArr[j], 1);
      }
    }
  }
}

//funcao fora do ecra

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
    this.radius = this.width / 2;
  }

  jump() {
    if (this.y > 285 - this.height) {
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

    this.x += this.velX;
    this.velY += gravity;
    this.y += this.velY;
    const weColliding = obstacles.find((obj) => {
      return collision(myPlayer, obj);
    });

    if (weColliding) {
      this.velX *= -0.25; // reverse direction
      this.velY *= -0.65;
      this.x += this.velX;
      this.y += this.velY;
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
  }

  move() {
    this.x -= 4;
    totalScore += 0.01;
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
    this.x -= 4;
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
  myPlayer.draw();
  myPlayer.move();
  collisionBoxThorns();
  const score = document.querySelector(".score span");
  score.innerText = Math.floor(totalScore);
  if (frameCount % 351 === 0) {
    obstacles.push(new box());
  }
  if (frameCount % 456 === 0) {
    thornsArr.push(new thorns());
  }

  if (frameCount % 200 === 0) {
    ringArr.push(new ring());
  }

  //Create multiple thorns
  for (let j = thornsArr.length - 1; j >= 0; j--) {
    thornsArr[j].draw();
    thornsArr[j].move();

    if (collision(myPlayer, thornsArr[j])) {
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

  for (let a = ringArr.length - 1; a >= 0; a--) {
    ringArr[a].draw();
    ringArr[a].move();

    if (collision(myPlayer, ringArr[a])) {
      totalScore += 25;
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
