import Fish from './fish.js';
import ActionManager from './actions.js';

window.GAME_HEIGHT = 768;
window.GAME_WIDTH = 768;
window.NUM_TYPES_FISH = 10;

window.bg = null; // The aquarium's background image
window.fishImages = []; // The fish images
window.emoteImages = []; // The emote images
window.emoteImages = {
  heart: null,
  happy: null,
  sleepy: null,
  angry: null,
};
window.fishInTank = []; // Fish currently in the tank
window.actionManager = new ActionManager(); 

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
}

function draw() {
  background(bg);
  fishInTank.forEach(fish => {
    actionManager.update(); 
    fish.update();
  }); 
}

window.preload = preload; 
window.setup = setup;
window.draw = draw; 
