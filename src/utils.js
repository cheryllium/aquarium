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
    "An", "Art", "Al", "Bart", "Ban", "Cal", "Cir", "Cor", "Dar", "Dan", "Dac", "El", "Fant", "Fin", "Gin", "Gan", "Gat", "Hol", "Hef", "Hid", "Iol", "Is", "Jul", "Lor", "Lun", "Mack", "Mer", "Nash", "Nin", "Ria", "Rhys", "Rud", "Sal", "Slart", "Sol", "Tan", "Tor", "Ul", "Var", "Vir", "Xan", "Yal"
  ];
  let two = ["i", "a", "an", "o", "ou", "en", "u"];
  let three = ["ba", "ce", "da", "fer", "gi", "na", "nol", "nette", "lette", "nice", "nis", "lyr", "la", "rice", "rie", "ry", "lie", "ly"];

  randOne = one[randomIntFromInterval(0, one.length-1)];
  randTwo = two[randomIntFromInterval(0, two.length-1)];
  randThree = three[randomIntFromInterval(0, three.length-1)];

  if (Math.random() > 0.5) {
    return randOne + randThree; 
  } else {
    return randOne + randTwo + randThree;
  }
}
