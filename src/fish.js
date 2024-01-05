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

    this.flipOverride = null;
    this.selected = false;
    
    this.history = [];
    
    // Personal information about this fish
    this.name = randomFishName();
    let goodMood = Math.random() > 0.5; 
    this.updateMood(goodMood, false, goodMood ? "is having a good day." : "is having a grumpy day.");
    this.favoriteFood = Object.keys(foodImages)[randomIntFromInterval(0, Object.keys(foodImages).length-1)];
    this.favoriteColor = color(
      randomIntFromInterval(0, 255),
      255,
      25
    );
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

  moveTowardsMouse () {
    // Do nothing else if mouse is off screen
    if (mouseX < 0 || mouseX > GAME_WIDTH
        || mouseY < 0 || mouseY > GAME_HEIGHT) {
      return; 
    }

    // Do nothing if mouse is idle
    if (mouseIdle > 5000) {
      return; 
    }
    
    let d = distance(this.x, this.y, mouseX, mouseY);
    if (d < 200) {
      this.dx += (mouseX - this.x) / 80;
      this.dy += (mouseY - this.y) / 80; 
    }
  }
  
  moveTowardsFood () {
    foodInTank.forEach(food => {
      // For each food in tank, calculate distance between this fish
      let d = distance(this.x, this.y, food.x, food.y); 
      // If distance is within a certain amount, move towards food
      if (d < 250) {
        this.dx += (food.x - this.x) / 70;
        this.dy += (food.y - this.y) / 70;
      }
    }); 
  }

  isFlipped() {
    if (!this.flipOverride) {
      return this.dx > 0; 
    }
    return this.flipOverride === 'right'; 
  }
  
  /* Moves the fish according to its velocity, making sure it's 
   * facing the right direction, and updating any anchored images. */
  update () {
    // Update velocity based on state
    switch (this.state) {
      case states.BOIDING:
        this.moveTowardsMouse();
        // Move towards nearby food if not in the middle of an action
        if (!this.action) {
          this.moveTowardsFood(); 
        }
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
    if (deltaTime > 100) {
      // If browser tab was inactive for a length of time,
      // reset deltaTime to something reasonable
      // so that fish don't go flying!
      deltaTime = 30; 
    }
    this.x += this.dx * deltaTime / 1000;
    this.y += this.dy * deltaTime / 1000;

    let fishImage = fishImages[this.type-1];
    if (this.selected) {
      fishImage = fishImagesSelected[this.type-1]; 
    }
    if (this.isFlipped()) {
      push();
      translate(this.x, this.y);
      scale(-1, 1);
      image(fishImage, -fishImage.width, 0);
      if (this.emotion) {
        image(speechBubbleImage, -fishImage.width - speechBubbleImage.width + 5, -20);
        scale(-1, 1); 
        image(emoteImages[this.emotion], fishImage.width + 5, -17); 
      }
      pop(); 
    } else {
      image(fishImage, this.x, this.y);
      if (this.emotion) {
        image(speechBubbleImage, this.x - speechBubbleImage.width + 5, this.y - 20); 
        image(emoteImages[this.emotion],
              this.x - speechBubbleImage.width + emoteImages[this.emotion].width/2,
              this.y - 17);
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
    this.flipOverride = null; 
  }

  updateMood (goodMood, addRecord, reason) {
    let goodMoods = ["cheerful", "jovial", "happy", "great"];
    let badMoods = ["grumpy", "upset", "moody", "down"]; 
    this.goodMood = goodMood;
    if (goodMood) {
      this.mood = goodMoods[randomIntFromInterval(0, goodMoods.length-1)]; 
    } else {
      this.mood = badMoods[randomIntFromInterval(0, badMoods.length-1)]; 
    }

    if (addRecord) {
      uiManager.addRecord(`FISH1 is feeling ${this.mood}.`, this);
      console.log(this.history); 
    }

    if (reason) {
      this.history.unshift(`Feeling ${this.mood} because it ${reason}`);
    }

    if (this.selected) {
      uiManager.updateFishInfo();
      uiManager.updateFishJournal(this); 
    }

    uiManager.updateFishStats(); 
  }
}
