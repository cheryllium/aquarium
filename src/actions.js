const SCRIPTS = {
  happy: [
    { type: 'emote', value: 'happy', duration: 3000 },
    { type: 'wait', duration: 1000 },
    { type: 'emote', value: 'heart', duration: 3000 },
  ],
};

export default class ActionManager {
  constructor () {
    this.activeScripts = []; 
  }

  doAction (fish, action) {
    console.log('doing action', action);
    switch (action.type) {
      case 'emote':
        fish.emote(action.value);
        break;
      case 'wait':
        fish.emote(null);
        break;
    }
  }
  
  update () {
    for (let script of this.activeScripts) {
      if (typeof(script.step) === 'undefined') {
        console.log('doing first step');
        // First step
        script.step = 0;
        script.last = Date.now();
        script.fish.action = true;
        this.doAction(script.fish, SCRIPTS[script.script][script.step]);
      } else {
        if (Date.now() > script.last + SCRIPTS[script.script][script.step].duration) {
          if (script.step == SCRIPTS[script.script].length - 1) {
            console.log('doing last step', script.step);
            // Finished the last step
            script.fish.reset();
            script.remove = true;
          } else {
            console.log('incrementing step');
            script.step++;
            script.last = Date.now()
            this.doAction(script.fish, SCRIPTS[script.script][script.step]);
          }
        }
      }
    }

    this.activeScripts = this.activeScripts.filter(script => !script.remove);
  }
}
