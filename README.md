RedBall Inifinity

Description

Game inspired by the famous game "Bounce", from the 90s. A simple recreation to demonstrate all the skills that were learned in Bootcamp.
In my game, the ball has to jump over boxes and throns in order to catch rings to earn more points.
If the ball lands on the thorns, the game is over.

MVP
* The game has a ball that moves horizontally and can jump
* The ball needs go under the obstacles
* If the thorns collide with boxes, they explode
* The player needs to catch the rings to increase the score
* The player loses when the ball hits the thorns

Backlog
* rings to increase the score
* sounds

Data structure

game-spec.js
Correction Move
* decayVelocity(){}

Collisions
* collision2(){}
* collision(){}
* collisionBoxThorns(){}
* byCollisionWith(){}
* onbox(){}
* offscreen(){}

Score
* increaseScore(){}


Player
* playerOne(){this.pos.x, this.pos.y, this.radius * 2}
* jump(){}
* move(){}
* draw(){}

Wood Box
* box(){this.x, this.y, this.width, this.height}
* move(){}
* draw(){}

Thorns
* thorns(){this.x, this.y, this.width, this.height}
* move(){}
* draw(){}

Rings
* ring(){this.x, this.y, this.width, this.height}
* move(){}
* draw(){}

Main Draw
* draw(){}

Game Over
* gameOver(){}

States y States Transitions
Definition of the different states and their transition (transition functions)

* intro-game
* game-area
* gameOver


Additional Links
Link url

Slides
Link https://docs.google.com/presentation/d/1b1aH_fIWDEhc5zBH3KZbRMHkgIV0hikfAGFqmRiIunA/edit?usp=sharing