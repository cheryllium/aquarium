export default class ActionManager {
  constructor () {
    this.actions = [
      {
        last: currentTime(),
        interval: 3,
        callback: function () {
          fishInTank[randomIntFromInterval(0, fishInTank.length-1)].emote("happy", 3000); 
        }
      }, 
    ];
  }
  
  update () {
    for(let action of this.actions) {
      if (currentTime() > action.last + action.interval) {
        action.callback();
        action.last = currentTime(); 
      }
    }
  }
}
