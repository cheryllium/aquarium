import { states as fishStates } from './fish.js';

export const SCRIPTS = {
  happy: [
    { type: 'emote', value: 'happy', duration: 3000 }, // Set emote to happy, wait 3s
    { type: 'emote', value: null, duration: 1000 }, // Set emote to nothing, wait 3s
    { type: 'state', value: fishStates.IDLING, duration: 2000 }, // Set state to idling for 2s
    { type: 'state', value: fishStates.BOIDING, duration: 0 }, // Set state to boiding, go to next action
    { type: 'emote', value: 'heart', duration: 3000 }, // Set emote to heart, wait 3s
  ],
  moveToCorner: [
    { type: 'state', value: fishStates.MOVING, duration: 4000, moveto: {x: 500, y: 500} },
    { type: 'state', value: fishStates.IDLING, duration: 4000 }
  ],
  chat1: [
    [
      { type: 'state', value: fishStates.IDLING, duration: 1000 }, 
      { type: 'emote', value: 'happy', duration: 3000 },
      { type: 'emote', value: 'heart', duration: 4000 },
    ],
    [
      { type: 'state', value: fishStates.IDLING, duration: 2000 },
      { type: 'emote', value: 'sleepy', duration: 3000 },
      { type: 'emote', value: 'heart', duration: 3000 }, 
    ], 
  ], 
};

export default class RoutineManager {
  constructor () {
    this.events = []; 
  }

  addEvent(delta, chance, callback) {
    this.events.push({
      lastFired: Date.now(),
      update: function () {
        if (Date.now() > this.lastFired + delta) {
          this.lastFired = Date.now(); 
          if (Math.random() < chance) {
            callback(); 
          }
        }
      }
    });
  }
  
  update () {
    // Routine random events
    this.events.forEach(event => event.update());
  }

  initialize () {
    // Random happy fish
    this.addEvent(4000, 0.5, function () {
      let filteredFish = fishInTank.filter(fish => !fish.action);
      let fish = filteredFish[randomIntFromInterval(0, filteredFish.length - 1)]; 
      actionManager.fishRoutines.push(
        {
          fish,
          script: SCRIPTS.happy,
        }
      );
    });

    // Random fish conversation
    this.addEvent(10000, 0.4, function () {
      console.log('Starting conversation');
      
      let filteredFish = fishInTank.filter(fish => !fish.action);

      // Find two random fish
      let indexA, indexB; 
      indexA = randomIntFromInterval(0, filteredFish.length-1);
      do {
        indexB = randomIntFromInterval(0, filteredFish.length-1);
      } while (indexB == indexA); 

      // Choose two random conversation scripts
      let scriptA = JSON.parse(JSON.stringify(SCRIPTS.chat1[0]));
      let scriptB = JSON.parse(JSON.stringify(SCRIPTS.chat1[1]));
      
      // Calculate two points near the midpoint to move the fish
      let midpoint = {x: randomIntFromInterval(200, 400), y:randomIntFromInterval(200, 600)}; 
      let pointA = {x: midpoint.x - fishImages[filteredFish[indexA].type-1].width/2, y: midpoint.y}; 
      let pointB = {x: midpoint.x + fishImages[filteredFish[indexB].type-1].width/2 + 75, y: midpoint.y}; 

      // Flip the two fish to be facing each other (happens after move, must add to array first)
      scriptA.unshift({ type: 'flip', value: 'right', duration: 0 });
      scriptB.unshift({ type: 'flip', value: 'left', duration: 0 }); 

      // Add the move-to-point on the beginning of both scripts
      scriptA.unshift(
        { type: 'state', value: fishStates.MOVING, duration: 3000, moveto: pointA }
      ); 
      scriptB.unshift(
        { type: 'state', value: fishStates.MOVING, duration: 3000, moveto: pointB }
      );
      
      // Start the routines on both fish
      actionManager.fishRoutines.push(
        { fish: filteredFish[indexA], script: scriptA }
      );
      actionManager.fishRoutines.push(
        { fish: filteredFish[indexB], script: scriptB }
      );
    }); 
  }
}
