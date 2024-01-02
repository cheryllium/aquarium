export const states = {
  BOIDING: 1,
  IDLING: 2,
  MOVING: 3, 
};
let visualRange = 15; // Visual range of a fish

export default class Fish {
  constructor (type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;

    this.setRandomVelocity(); 

    this.state = states.BOIDING;
    this.emotion = null;
    this.action = false; 
  }

  setRandomVelocity() {
    this.dx = Math.random() * 30 + 90;
    if (Math.random() < 0.5) {
      this.dx *= -1; 
    }
    this.dy = Math.random() * 30;
    if (Math.random() < 0.5) {
      this.dy *= -1; 
    }
  }
  
  moveTowardsCenter() {
    let centeringFactor = 0.2;
    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;

    for(let otherFish of fishInTank.filter(fish => fish.state === states.BOIDING)) {
      if (distance(this.x, this.y, otherFish.x, otherFish.y) < visualRange) {
        centerX += otherFish.x;
        centerY += otherFish.y;
        numNeighbors += 1; 
      }
    }

    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;

      this.dx += (centerX - this.x) * centeringFactor;
      this.dx += (centerY - this.y) * centeringFactor; 
    }
  }

  avoidCollisions() {
    let minDistance = 25;
    let avoidFactor = 0.1;
    let moveX = 0;
    let moveY = 0;
    for(let otherFish of fishInTank.filter(fish => fish.state === states.BOIDING)) {
      if (otherFish !== this) {
        if (distance(this.x, this.y, otherFish.x, otherFish.y) < minDistance) {
          moveX += this.x - otherFish.x;
          moveY += this.y - otherFish.y; 
        }
      }
    }

    this.dx += moveX * avoidFactor;
    this.dy += moveY * avoidFactor; 
  }

  matchVelocity() {
    let matchingFactor = 0.05;
    let avgDx = 0;
    let avgDy = 0;
    let numNeighbors = 0; 
    for(let otherFish of fishInTank.filter(fish => fish.state === states.BOIDING)) {
      if (distance(this.x, this.y, otherFish.x, otherFish.y) < visualRange) {
        avgDx += otherFish.dx;
        avgDy += otherFish.dy;
        numNeighbors += 1; 
      }
    }

    if (numNeighbors) {
      avgDx = avgDx / numNeighbors;
      avgDy = avgDy / numNeighbors;

      this.dx += (avgDx - this.dx) * matchingFactor;
      this.dy += (avgDy - this.dy) * matchingFactor; 
    }
  }

  limitSpeed() {
    let speedLimit = 175;
    let speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (speed > speedLimit) {
      this.dx = (this.dx / speed) * speedLimit;
      this.dy = (this.dy / speed) * speedLimit; 
    }

    // Limit Y velocity of boids
    if (this.dy > 50) {
      this.dy = 50;
    }
  }

  boids () {
    // Boids rules
    this.moveTowardsCenter();
    this.avoidCollisions();
    this.matchVelocity();
    this.limitSpeed(); 
  }
  
  /* Moves the fish according to its velocity, making sure it's 
   * facing the right direction, and updating any anchored images. */
  update () {
    // Update velocity based on state
    switch (this.state) {
      case states.BOIDING: 
        this.boids();
        break;
      case states.IDLING:
        this.dx = 0;
        this.dy = 0; 
        break;
      case states.MOVING:
        // Just move according to its velocity
        break; 
    }

    // Make sure fish stays within bounds of tank
    let marginX = 40;
    let marginY = 80; 
    let turnFactor = 25;
    if (this.x < marginX) {
      this.dx += turnFactor; 
    }
    if (this.x > GAME_WIDTH - marginX) {
      this.dx -= turnFactor; 
    }
    if (this.y < marginY) {
      this.dy += turnFactor; 
    }
    if (this.y > GAME_HEIGHT - marginY) {
      this.dy -= turnFactor; 
    }
    
    // Move fish forward
    this.x += this.dx * deltaTime / 1000;
    this.y += this.dy * deltaTime / 1000;
    if (this.dx > 0) {
      push();
      translate(this.x, this.y);
      scale(-1, 1);
      image(fishImages[this.type-1], -fishImages[this.type-1].width, 0);
      if (this.emotion) {
        image(emoteImages[this.emotion],
              -emoteImages[this.emotion].width - fishImages[this.type-1].width + 15,
              -20);
      }
      pop(); 
    } else {
      image(fishImages[this.type-1], this.x, this.y);
      if (this.emotion) {
        image(emoteImages[this.emotion],
              this.x - fishImages[this.type-1].width + emoteImages[this.emotion].width/2 + 15,
              this.y - 20);
      }
    }
  }

  emote (emotion, timeout) {
    this.emotion = emotion;
    if (timeout) {
      setTimeout(function () {
        this.emotion = null; 
      }.bind(this), timeout);
    }
  }

  reset () {
    this.emotion = null;
    this.state = states.BOIDING; 
    this.setRandomVelocity(); 
    this.action = false; 
  }
}

