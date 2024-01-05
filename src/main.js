import Fish from './fish.js';
import Food from './food.js'; 
import ActionManager from './actions.js';
import RoutineManager from './routines.js';
import UIManager from './ui.js';

window.GAME_HEIGHT = 768;
window.GAME_WIDTH = 768;
window.NUM_TYPES_FISH = 10;

window.bg = null; // The aquarium's background image
window.fishImages = []; // The fish images
window.fishImagesSelected = [];
window.speechBubbleImage = null; 
window.emoteImages = {
  heart: null,
  happy: null,
  sleepy: null,
  angry: null,
  grumpy: null,
  wave: null,
  smile: null,
  surprised: null,
  yelling: null,
  boo: null,
  sad: null,
  laugh: null,
};
window.foodImages = {
  broccoli: null,
  hamburger: null,
  icecream: null,
  pumpkinpie: null,
}; 
window.fishInTank = []; // Fish currently in the tank
window.foodInTank = []; 
window.actionManager = new ActionManager();
window.routineManager = new RoutineManager();
window.uiManager = new UIManager(); 

function preload() {
  // Load background image
  bg = loadImage('assets/background.png');

  // Load fish images
  for(let i=1; i<=NUM_TYPES_FISH; i++) {
    fishImages.push(
      loadImage(`assets/fish/fish${i}.png`)
    );
    fishImagesSelected.push(
      loadImage(`assets/fish/fish${i}-selected.png`)
    );
  }
  
  // Load emote images
  speechBubbleImage = loadImage("assets/speech-bubble-blank.png");
  for(let key of Object.keys(emoteImages)) {
    emoteImages[key] = loadImage(`assets/emotes/${key}.png`)
  }

  // Load food images
  for(let key of Object.keys(foodImages)) {
    foodImages[key] = loadImage(`assets/food/${key}.png`); 
  }
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);

  for(let i=0; i<30; i++) {
    fishInTank.push(
      new Fish(
        randomIntFromInterval(1, NUM_TYPES_FISH),
        randomIntFromInterval(100, 600),
        randomIntFromInterval(100, 600),
      )
    );
  }
  routineManager.initialize();
  uiManager.updateFishInfo(); 
}

function draw() {
  background(bg);
  
  fishInTank.forEach(fish => {
    fish.update();
  });
  foodInTank.forEach(food => {
    food.update(); 
  });
  foodInTank = foodInTank.filter(food => !food.remove);
  
  actionManager.update();
  routineManager.update();
}

function mouseClicked(event) {
  // Do nothing else if mouse is off screen
  if (mouseX < 0 || mouseX > GAME_WIDTH
      || mouseY < 0 || mouseY > GAME_HEIGHT) {
    return; 
  }

  // Deselect any selected fish
  for(let fish of fishInTank) {
    if (fish.selected) {
      uiManager.updateSelected(fish, false); 
    }
  }

  // If you clicked on a fish, select the fish  
  let spawnFood = true;
  for(let fish of fishInTank) {
    if (mouseX > fish.x && mouseX < fish.x + fishImages[fish.type-1].width
        && mouseY > fish.y && mouseY < fish.y + fishImages[fish.type-1].height) {
      spawnFood = false;
      uiManager.updateSelected(fish, true);
      break; 
    }
  }

  // Otherwise, spawn food
  if (spawnFood) {
    let foodKeys = Object.keys(foodImages);
    let randomFood = foodKeys[randomIntFromInterval(0, foodKeys.length-1)];
    foodInTank.push(
      new Food(randomFood, mouseX, mouseY)
    );
  }
}

window.preload = preload; 
window.setup = setup;
window.draw = draw; 
window.mouseClicked = mouseClicked; 
