let bg;
let ball;
let box;
const obstacles = [];
const thorns = [];


const gameArea = document.querySelector('.game-area');

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
    bg = loadImage('/img/background.png');
    ball = loadImage('/img/ball.png');
    box = loadImage('/img/wood-box.png');
    const canvas = createCanvas(800, 400);
    canvas.parent(gameArea);
    playerOne = new playerOne();
    obstacles.push(new Obstacle(600,200, 100, 100));
    
}


class Square {
    constructor(x, y, width, height) {
      this.height = height;
      this.width = width;
      this.x = x;
      this.y = y;
    }
  
    draw() {
      image(box, this.x, this.y, this.width, this.height);
    }
  }
  
  class Obstacle extends Square {
    constructor(x, y, width, height) {
      super(x, y, width, height);
    }
  }


class playerOne {
    constructor(){
        this.x = 5;
        this.y = 250;
        this.velX = 0;
        this.velY = 0;
        this.width = 50;
        this.height = 50;
    }

    draw () {

        image(ball,this.x, this.y, this.width, this.height);
    }

    gravaty() {
        const touchGroundBall = this.y + this.height;
        return touchGroundBall >= 250;
    }

    move() {
        if(keyIsDown(LEFT_ARROW)) {
            this.velX -= 0.25;
        }
        if(keyIsDown(RIGHT_ARROW)) {
            this.velX += 0.25;
        }

        this.velX = decayVelocity(this.velX);

        // make the limits
        this.x += this.velX;
        this.y += this.velY;
        this.velY += 0.5;
        this.y += this.velY;
  

          this.x = max(1, this.x);
          this.x = min(this.x, 750 - this.width - 1);
          this.y = max(this.y, 50 + this.height + 1)
          this.y = min(this.y, 300 - this.height - 1);
    }

}

function keyPressed() {
    if (keyCode === UP_ARROW) {
      playerOne.velY = - 8;
    }
  }


function draw() {
    background(bg);
    obstacles.forEach((obstacle) => obstacle.draw());
    playerOne.draw();
    playerOne.move();
}









// function collidingInXDir(square1, square2) {
//     const leftOfSquare1 = square1.x;
//     const rightOfSquare1 = square1.x + square1.width;
//     const topOfSquare1 = square1.y;
//     const bottomOfSquare1 = square1.y + square1.height;
//     const collidingInXDirection =
//       rightOfSquare1 > leftOfSquare2 && rightOfSquare2 > leftOfSquare1;
//     return collidingInXDirection;
//   }
//   function boxCollision(square1, square2) {
//     // simple collision detections -> AABB for 2 rects without rotation
//     if (square1 instanceof Square && square2 instanceof Square) {
//       const leftOfSquare1 = square1.x;
//       const rightOfSquare1 = square1.x + square1.width;
//       const topOfSquare1 = square1.y;
//       const bottomOfSquare1 = square1.y + square1.height;
  
//       const leftOfSquare2 = square2.x;
//       const rightOfSquare2 = square2.x + square2.width;
//       const topOfSquare2 = square2.y;
//       const bottomOfSquare2 = square2.y + square2.height;
  
//       const collidingInXDirection =
//         rightOfSquare1 > leftOfSquare2 && rightOfSquare2 > leftOfSquare1;
  
//       const collidingInYDirection =
//         bottomOfRect1 > topOfSquare2 && bottomOfSquare2 > topOfRect1;
  
//     //   console.log("X Collision?", collidingInXDirection);
//     //   console.log("Y Collision?", collidingInYDirection);
//       return collidingInXDirection && collidingInYDirection;
//     }
//     // console.log("Those are not Squares");
//   }

// function ballColliding() {
//     const obstaclesWeWouldCollideWith = obstacles.filter((obstacle) => {
//       return boxCollision(playerOne, obstacle);
//     });
//     return obstaclesWeWouldCollideWith.length >= 1;
// }