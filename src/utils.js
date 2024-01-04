function distance(x1, y1, x2, y2) {
  return Math.sqrt(
    (x2 - x1) * (x2 - x1) +
      (y2 - y1) * (y2 - y1)
  );
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/* The current unix time in seconds */
function currentTime () {
  return Math.floor(Date.now() / 1000)
}

function randomFishName() {
  let one = [
    "An", "Art",  "Bart", "Cal", "Cor", "Dar", "Dac", "Ell", "Fant", "Fin", "Gin", "Gan", "Gat", "Hol", "Holl", "Heff", "Hid", "Iol", "Is", "Jul", "Lor", "Lun", "Mack", "Nash", "Slart",  "Sol", 
  ];
  let two = ["i", "a", "an", "o", "ou", "en", "u"];
  let three = ["na", "fer", "nol", "nette", "lette", "nice", "nis", "lyr", "la", "rice", "rie", "ry", "lie", "ly"];

  randOne = one[randomIntFromInterval(0, one.length-1)];
  randTwo = two[randomIntFromInterval(0, two.length-1)];
  randThree = three[randomIntFromInterval(0, three.length-1)];

  if (Math.random() > 0.5) {
    return randOne + randThree; 
  } else {
    return randOne + randTwo + randThree;
  }
}
