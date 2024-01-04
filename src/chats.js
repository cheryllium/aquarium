import { states as fishStates } from './fish.js';

let pleasantChat = {
  description: "FISH1 and FISH2 are having a nice chat.", 
  start: ['wave', 'wave', 'smile'], 
  positive: ['smile', 'happy', 'heart', 'A-happy', 'B-happy'], 
  negative: ['angry', 'surprised', 'grumpy', 'A-unhappy'],
  isPositive: function (fish1, fish2) {
    return Math.random() < 0.8; 
  },
};
let prankChat = {
  description: "FISH1 is playing a prank on FISH2!", 
  start: ['boo', 'surprised', 'laugh'],
  positive: ['laugh', 'heart', 'heart', 'A-happy', 'B-happy'],
  negative: ['angry', 'surprised', 'grumpy', 'B-unhappy'],
  isPositive: function (fish1, fish2) {
    if (!fish2.goodMood) {
      return Math.random() < 0.5; 
    }
    return Math.random() < 0.9;
  },
};
let cheerUpChat = {
  description: "FISH1 is trying to cheer FISH2 up.", 
  start: ['smile', 'grumpy', 'heart'],
  positive: ['heart', 'happy', 'smile', 'B-happy'],
  negative: ['angry', 'surprised', 'grumpy', 'A-unhappy'],
  isPositive: function (fish1, fish2) {
    return Math.random() < 0.7; 
  }, 
};
let argumentChat = {
  description: "FISH1 and FISH2 are arguing about something...", 
  start: ['yelling', 'angry', 'angry'],
  positive: ['sad', 'heart', 'heart', 'A-happy', 'B-happy'],
  negative: ['yelling', 'grumpy', 'grumpy', 'A-unhappy', 'B-unhappy'],
  isPositive: function (fish1, fish2) {
    if (!fish1.goodMood && !fish2.goodMood) {
      return false; 
    }
    if (fish1.goodMood && fish2.goodMood) {
      return Math.random() < 0.5; 
    }
    return Math.random() < 0.3; 
  }
};

export default function generateChatScripts(fish1, fish2) {
  console.log(`${fish1.name} is feeling ${fish1.mood}`);
  console.log(`${fish2.name} is feeling ${fish2.mood}`);

  // Choose which chat the fish will have
  let chat = null;
  let chance = Math.random(); 
  if (fish1.goodMood && fish2.goodMood) {
    // Both fish are in a good mood
    if (chance < 0.6) {
      chat = pleasantChat; 
    } else if (chance < 0.9) {
      chat = prankChat; 
    } else {
      chat = argumentChat; 
    }
  } else if (fish1.goodMood && !fish2.goodMood) {
    // Only first fish is in a good mood
    if (chance < 0.7) {
      chat = cheerUpChat; 
    } else if (chance < 0.8) {
      chat = pleasantChat; 
    } else if (chance < 0.9) {
      chat = argumentChat; 
    } else {
      chat = prankChat; 
    }
  } else if (!fish1.goodMood && !fish2.goodMood) {
    // Both fish are in a bad mood
    if (chance < 0.8) {
      chat = argumentChat; 
    } else if (chance < 0.9) {
      chat = prankChat; 
    } else {
      chat = pleasantChat; 
    }
  } else {
    // Only second fish is in a good mood
    if (chance < 0.5) {
      chat = argumentChat; 
    } else if (chance < 0.9) {
      chat = pleasantChat; 
    } else {
      chat = prankChat; 
    }
  }

  // Determine whether the chat is positive or negative
  let isPositive = chat.isPositive(fish1, fish2); 

  // Concatenate the script cues
  let cues = chat.start; 
  if (isPositive) {
    cues = cues.concat(chat.positive); 
  } else {
    cues = cues.concat(chat.negative); 
  }

  // Construct the two actual scripts
  let scriptA = [
    { type: 'state', value: fishStates.IDLING, duration: 1000 } 
  ];
  let scriptB = [
    { type: 'state', value: fishStates.IDLING, duration: 2000 }
  ];
  let flagA = true;
  for(let cue of cues) {
    let action = {};
    if (cue.includes("-")) {
      action.type = "mood";
      action.value = cue.includes("-happy");
      action.duration = 0;
      if (cue.includes("A-")) {
        scriptA.push(action); 
      } else {
        scriptB.push(action); 
      }
    } else {
      action.type = "emote";
      action.value = cue;
      action.duration = 3000;
      if (flagA) {
        scriptA.push(action); 
      } else {
        scriptB.push(action); 
      }
      flagA = !flagA; 
    }
  }

  return {
    record: chat.description,
    scriptA,
    scriptB, 
  };
}
