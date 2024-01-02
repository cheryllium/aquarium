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
};

export default class ActionManager {
  constructor () {
    this.activeScripts = []; 
  }

  doAction (fish, action) {
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
    }
  }
  
  update () {
    for (let script of this.activeScripts) {
      if (typeof(script.step) === 'undefined') {
        // First step
        script.step = 0;
        script.last = Date.now();
        script.fish.action = true;
        this.doAction(script.fish, script.script[script.step]);
      } else {
        if (Date.now() > script.last + script.script[script.step].duration) {
          if (script.step == script.script.length - 1) {
            // Finished the last step
            script.fish.reset();
            script.remove = true;
          } else {
            script.step++;
            script.last = Date.now()
            this.doAction(script.fish, script.script[script.step]);
          }
        }
      }
    }

    this.activeScripts = this.activeScripts.filter(script => !script.remove);
  }
}
