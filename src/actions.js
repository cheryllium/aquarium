import { states as fishStates } from './fish.js';

/* ACTIONS: 
* Scripts are arrays of actions. 
* Each action is a dictionary containing a type, value, and duration. 
* An action represents a single state change for a fish. 
* - type: either 'emote' or 'state'
*     A fish has a state (boiding, idling, etc) and can also emote. 
* - value: the value to change the fish's emote or state to. 
* - duration: how long to wait before going to the next action. 
* 
* When a script is done running, the fish's state is reset to boiding 
* with no emote, by calling the reset() method on the fish. 
*/
export default class ActionManager {
  constructor () {
    this.fishRoutines = []; 
  }

  doAction (fish, action) {
    console.log('doing action', action);
    switch (action.type) {
      case 'emote':
        fish.emote(action.value);
        break;
      case 'state':
        fish.state = action.value;
        
        switch (action.value) {
          case fishStates.BOIDING:
            fish.setRandomVelocity();
            break;
          case fishStates.MOVING:
            if (action.moveto) {
              fish.dx = (action.moveto.x - fish.x) / action.duration * 1000;
              fish.dy = (action.moveto.y - fish.y) / action.duration * 1000; 
            }
        }
        break;
      case 'flip':
        fish.flipOverride = action.value;
        break;
    }
  }
  
  update () {
    for (let routine of this.fishRoutines) {
      if (typeof(routine.step) === 'undefined') {
        // First step
        routine.step = 0;
        routine.last = Date.now();
        routine.fish.action = true;
        this.doAction(routine.fish, routine.script[routine.step]);
      } else {
        if (Date.now() > routine.last + routine.script[routine.step].duration) {
          if (routine.step == routine.script.length - 1) {
            // Finished the last step
            routine.fish.reset();
            routine.remove = true;
          } else {
            routine.step++;
            routine.last = Date.now()
            this.doAction(routine.fish, routine.script[routine.step]);
          }
        }
      }
    }

    this.fishRoutines = this.fishRoutines.filter(routine => !routine.remove);
  }
}
