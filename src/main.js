import Fish from './fish.js';
import Food from './food.js'; 
import ActionManager from './actions.js';
import RoutineManager from './routines.js';

window.GAME_HEIGHT = 768;
window.GAME_WIDTH = 768;
window.NUM_TYPES_FISH = 10;

window.bg = null; // The aquarium's background image
window.fishImages = []; // The fish images
window.emoteImages = {
  heart: null,
  happy: null,
  sleepy: null,
  angry: null,
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

function preload() {
  // Load background image
  bg = loadImage('assets/background.png');

  // Load fish images
  for(let i=1; i<=NUM_TYPES_FISH; i++) {
    fishImages.push(
      loadImage(`assets/fish/fish${i}.png`)
    );
  }

  // Load emote images
  for(let key of Object.keys(emoteImages)) {
    emoteImages[key] = loadImage(`assets/speech/speech-bubble-${key}.png`)
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

  foodInTank.push(new Food('hamburger', 100, 100)); 
  
  routineManager.initialize(); 
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

function mouseClicked() {
  console.log('mouse clicked');
  let foodKeys = Object.keys(foodImages);
  let randomFood = foodKeys[randomIntFromInterval(0, foodKeys.length-1)];
  foodInTank.push(
    new Food(randomFood, mouseX, mouseY)
  );
}

window.preload = preload; 
window.setup = setup;
window.draw = draw; 
window.mouseClicked = mouseClicked; 
