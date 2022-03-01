// create all variable for the game
let ball;
let backG;
let woodBox;
let thornsImg;
let totalScore = 0;
let gravity = 0.5;
const heightMax = 400;
const obstacles = [];
const thornsArr = [];

// create a variable to get the div with class .game-area
const gameArea = document.querySelector('.game-area');
const btnStart = document.querySelector('.start');
const btnRestart = document.querySelector('.restart');
const gameIntroBoard = document.querySelector('.intro-game');
const gameOverBoard = document.querySelector('.gameOver');

window.onload = () => {
    btnStart.onclick = () => {
        startGame();
    };
    btnRestart.onclick = () => {
        restartGame();
    };

    function startGame() {
        gameIntroBoard.style.display = "none";
        gameOverBoard.style.display = "none";
        gameArea.style.display = "flex";

        loop();
    }


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
function preload(){
    // loadImage for all variables
    ball = loadImage('/img/ball.png');
    backG = loadImage('/img/background.png');
    woodBox = loadImage('/img/wood-box.png');
    thornsImg = loadImage('/img/thorns.png');
}
function setup(){   
    // save the canvas area in a variable to display on html document
    const canvas = createCanvas(900,500);
    canvas.parent(gameArea);
    // block the game started
    noLoop();
    playerOne = new playerOne();
    obstacles.push(new box());
    thornsArr.push(new thorns());

}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        playerOne.jump();
    }
}

function collision(obj1, obj2){
    return(obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y);
}

function collisionBoxThorns (){
    for(let i = 0; i < obstacles.length; i ++){
      for(let j = 0; j< thornsArr.length; j++){
        if (collision (obstacles[i], thornsArr[j])){
            obstacles.push(obstacles[i]);
            thornsArr.splice(thornsArr[j], 1)
        } 
          
      }
    }    
  }

function offscreen(obj) {
    return obj.x === -obj.width;
}

//player class - all elements.
class playerOne {
    constructor(){
        this.width = 50;
        this.height = 50;
        this.x = 5;
        this.y = 350; // esta em teste
        this.velX = 0;
        this.velY = 0;
    }

    jump(){
        if (this.y > 285 - this.height){
            this.velY = - 10;
        }
    }

    //movements ball
    move() {
        if(keyIsDown(LEFT_ARROW)) {
            this.velX -= 0.25;
        }
        if(keyIsDown(RIGHT_ARROW)) {
            this.velX += 0.25;
        }
        
        this.velX = decayVelocity(this.velX);
        this.velY = decayVelocity(this.velY);

        this.x += this.velX;
        this.velY += gravity;
        this.y += this.velY;

        // Max width limits
        this.x = max(1, this.x);
        this.x = min(this.x, width - this.width - 1);
        this.y = max(this.y, 0 + this.height + 1)
        this.y = min(this.y, heightMax - this.height - 1);

    }


    draw() {
        image(ball, this.x, this.y, this.width, this.height);
    }
}

// create obstacle "woodBox"
class box{
    constructor(){
        this.width = 100;
        this.height = 100;
        this.x = width;
        this.y = heightMax - this.height;
        this.velX = 0;
    }

    move () {
        this.x -= 2;
        totalScore += 0.01;
    }

    draw () {
        image(woodBox, this.x, this.y, this.width, this.height);
    }
}

// create enemies "thorns"
class thorns {
    constructor(){
        this.width = 50;
        this.height = 50;
        this.x = width + (this.width * 2);
        this.y = heightMax - this.height;
    }

    move () {
        this.x -= 2;
    }

    draw () {
        image(thornsImg, this.x, this.y, this.width, this.height);
    }

}

// function countArray(array){
//     for(let i = 0; i < array.lenght; i++){
//         return array[i];
//     }
// }

// function to draw all elements.
function draw (){
    background(backG);
    playerOne.draw();
    playerOne.move();
    collisionBoxThorns();
    const score = document.querySelector(".score span");
    score.innerText= Math.floor(totalScore);
    if (frameCount % 450 === 0){
        obstacles.push(new box());
    }
    if(frameCount % 650 === 0 ){
        thornsArr.push(new thorns());
    }

    //Create multiple thorns
    for(let j = thornsArr.length -1; j >= 0; j--){
        thornsArr[j].draw();
        thornsArr[j].move();

        if(collision(playerOne, thornsArr[j])){
            gameOver();
        }

        if(offscreen(thornsArr[j])){
            totalScore += 25;
            thornsArr.splice(j, 1);
        }

    }
    
    //Create multiple box.
    for(let i = obstacles.length -1; i >= 0; i--){
        obstacles[i].draw();
        obstacles[i].move();

        //the object need have a shappe.
        if(collision(playerOne, obstacles[i])){
            playerOne.velX -= 0.2;
            if(playerOne.y >= obstacles[i].height){
                playerOne.y = 250;
            }
        }

        if(offscreen(obstacles[i])){
            totalScore += 5;
            obstacles.splice(i, 1);
        }
    }

}

function gameOver(){
    noLoop();

    gameOverBoard.style.display = "block";
    gameArea.style.display = "none";

    const highScore = document.querySelector(".high-score span");
    highScore.innerText= Math.floor(totalScore);
}

function restartGame(){

    playerOne = new playerOne();
    obstacles.push(new box());
    thornsArr.push(new thorns());
    totalScore = 0;
    gameIntroBoard.style.display = "none";
    gameOverBoard.style.display = "none";
    gameArea.style.display = "flex";

    loop();
}