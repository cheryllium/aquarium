import { states as fishStates } from './fish.js';
import generateChatScripts from './chats.js';

export const SCRIPTS = {
  heart: [
    { type: 'emote', value: 'heart', duration: 3000 },
  ],
  happy: [
    { type: 'emote', value: 'happy', duration: 3000 }, 
  ],
  grumpy: [
    { type: 'emote', value: 'grumpy', duration: 3000 },
  ],
};

export default class RoutineManager {
  constructor () {
    this.events = []; 
  }

  addEvent(id, delta, chance, callback) {
    this.events.push({
      id, 
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

  removeEvent(id) {
    this.events = this.events.filter(event => event.id != id);
  }
  
  update () {
    // Check if any fish has collided with a food item
    fishInTank.forEach(fish => {
      foodInTank.forEach(food => {
        // Food center is just the center of the food (x and y)
        let center1 = {x: food.x, y: food.y}; 
        // Food radius is half the width of the food
        let radius1 = foodImages[food.type].width / 2;
        
        // Fish center is going to be a little left or right of the mouth depending
        // on which way the fish is facing
        let center2 = {x: fish.x, y: fish.y + fishImages[fish.type-1].height/2};
        if (fish.isFlipped()) {
          center2.x += fishImages[fish.type-1].width - 10; 
        } else {
          center2.x += 10; 
        }
        // Fish radius is always hard-coded to the same value
        let radius2 = 10; 
        let d = distance(center1.x, center1.y, center2.x, center2.y);
        let collision = d <= radius1 + radius2;
        
        if (collision) {
          food.remove = true;
          uiManager.addRecord(`FISH1 ate a delicious ${food.type}!`, fish);
          if (food.type == fish.favoriteFood) {
            uiManager.addRecord("It's FISH1's favorite food!", fish);
            actionManager.fishRoutines.push({
              fish, script: SCRIPTS.heart,
            });
            fish.updateMood(true, true, "got to eat its favorite food!"); 
          } else {
            actionManager.fishRoutines.push({
              fish, script: SCRIPTS.happy,
            });
            if (Math.random() < 0.6) {
              fish.updateMood(true, true, `had a yummy ${food.type}.`); 
            }
          }
        }
      }); 
    });
    
    // Routine random events
    this.events.forEach(event => event.update());
  }

  initialize () {
    // Random fish emotes
    this.addEvent('general-mood', 4000, 0.5, function () {
      let filteredFish = fishInTank.filter(fish => !fish.action);
      let fish = filteredFish[randomIntFromInterval(0, filteredFish.length - 1)];

      if (fish.goodMood) {
        actionManager.fishRoutines.push({
          fish,
          script: SCRIPTS.happy,
        });
      } else {
        actionManager.fishRoutines.push({
          fish,
          script: SCRIPTS.grumpy,
        });
      }
    });

    // Random fish conversation
    this.addEvent('conversations', 13000, 0.4, function () {
      let filteredFish = fishInTank.filter(fish => !fish.action);

      // Find two random fish
      let indexA, indexB; 
      indexA = randomIntFromInterval(0, filteredFish.length-1);
      do {
        indexB = randomIntFromInterval(0, filteredFish.length-1);
      } while (indexB == indexA);

      let fish1 = filteredFish[indexA];
      let fish2 = filteredFish[indexB]; 

      // Choose random conversation script
      let chat = generateChatScripts(filteredFish[indexA], filteredFish[indexB])
      let scriptA = chat.scriptA; 
      let scriptB = chat.scriptB;

      // Fill in descriptions for mood actions in each script
      for(let action of scriptA) {
        if (action.description) {
          action.description = action.description
            .replace("FISH1", `<span style='color:${fish1.favoriteColor}'>${fish1.name}</span>`)
            .replace("FISH2", `<span style='color:${fish2.favoriteColor}'>${fish2.name}</span>`);
        }
      }
      for(let action of scriptB) {
        if (action.description) {
          action.description = action.description
            .replace("FISH1", `<span style='color:${fish1.favoriteColor}'>${fish1.name}</span>`)
            .replace("FISH2", `<span style='color:${fish2.favoriteColor}'>${fish2.name}</span>`);
        }
      }

      // Calculate two points near the midpoint to move the fish
      let midpoint = {x: randomIntFromInterval(100, 500), y:randomIntFromInterval(100, 700)}; 
      let pointA = {x: midpoint.x - fishImages[filteredFish[indexA].type-1].width/2, y: midpoint.y}; 
      let pointB = {x: midpoint.x + fishImages[filteredFish[indexB].type-1].width/2 + 85, y: midpoint.y}; 

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

      // Add record
      uiManager.addRecord(chat.record, filteredFish[indexA], filteredFish[indexB]);
    }); 
  }
}
