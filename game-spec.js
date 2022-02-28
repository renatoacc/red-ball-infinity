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

//player class - all elements.
class playerOne {
    constructor(){
        this.width = 50;
        this.height = 50;
        this.x = 5;
        this.y = 350;
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
    }

    move () {
        this.x -= 2;
        totalScore += 0.01;
    }

    draw () {
        image(woodBox, this.x, this.y, this.width, this.height);
    }
    // alterar para uma linha de codigo o if statement
    offscreen() {
        if (this.x === -100){
            return true;
        } else{
            return false;
        }
    }

    collision(playerOne){
        if(playerOne.y < this.y + this.height && playerOne.height + playerOne.y > this.y){
            if(((playerOne.x -1) + playerOne.width) > this.x && playerOne.x < this.x + this.width){
                return true;
            }
        }
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

    offscreen() {
        return this.x === -this.width;
    }

    collision(playerOne){
        if(playerOne.y < this.y + this.height && playerOne.height + playerOne.y > this.y){
            if((playerOne.x + playerOne.width) > this.x && playerOne.x < (this.x + this.width)){
                return true;
                
            }
        }
    }

    draw () {
        image(thornsImg, this.x, this.y, this.width, this.height);
    }

}

// function to draw all elements.
function draw (){
    background(backG);
    playerOne.draw();
    playerOne.move();

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

        if(thornsArr[j].collision(playerOne)){
            noLoop();
        }

        if(thornsArr[j].offscreen()){
            totalScore += 25;
            thornsArr.splice(j, 1);
        }

    }
    
    //Create multiple box.
    for(let i = obstacles.length -1; i >= 0; i--){
        obstacles[i].draw();
        obstacles[i].move();

        //the object need have a shappe.
        if(obstacles[i].collision(playerOne)){
            playerOne.velX = - 2.5;
            if(playerOne.y >= (obstacles[i].y - 2)){
                playerOne.y = 250 - 1;
            }
        }

        if(obstacles[i].offscreen()){
            totalScore += 5;
            obstacles.splice(i, 1);
        }
    }

}